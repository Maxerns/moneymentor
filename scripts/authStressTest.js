const { initializeApp } = require('firebase/app');
const { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  deleteUser,
  signOut
} = require('firebase/auth');
const fs = require('fs');

// Initialise Firebase with your config
const firebaseConfig = {
  apiKey: "AIzaSyBXIeCXVVkkqQYXWwimNZZ_OAGooLuvcvs",
  authDomain: "moneymentor-b3d4e.firebaseapp.com",
  projectId: "moneymentor-b3d4e",
  storageBucket: "moneymentor-b3d4e.firebasestorage.app",
  messagingSenderId: "452478486182",
  appId: "1:452478486182:web:fc03be67627d8438819667"
};

// Initialise Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Results storage
const results = {
  signIn: [],
  signUp: [],
  passwordReset: [],
  concurrentRequests: []
};

// Helper to generate random email
const generateRandomEmail = (prefix = 'stresstest') => 
  `${prefix}_${Math.floor(Math.random() * 10000000)}@test.com`;

// Helper to measure execution time
const measureTime = async (operation, ...args) => {
  const start = Date.now();
  try {
    const result = await operation(...args);
    const time = Date.now() - start;
    return { success: true, time, result };
  } catch (error) {
    const time = Date.now() - start;
    return { success: false, time, error: error.message };
  }
};

// Single Sign In Test
const testSignIn = async (email, password) => {
  const result = await measureTime(async () => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await signOut(auth);
    return userCredential;
  });
  
  results.signIn.push({
    email,
    duration: result.time,
    success: result.success,
    error: result.error
  });
  
  return result;
};

// Single Sign Up Test
const testSignUp = async (email, password) => {
  const result = await measureTime(async () => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  });
  
  results.signUp.push({
    email,
    duration: result.time,
    success: result.success,
    error: result.error
  });
  
  return result;
};

// Single Password Reset Test
const testPasswordReset = async (email) => {
  const result = await measureTime(() => sendPasswordResetEmail(auth, email));
  
  results.passwordReset.push({
    email,
    duration: result.time,
    success: result.success,
    error: result.error
  });
  
  return result;
};

// Concurrent sign-ins test
const testConcurrentSignIns = async (count, email, password) => {
  const startTime = Date.now();
  console.log(`Starting ${count} concurrent sign-ins...`);
  
  const promises = Array(count).fill(null).map((_, i) => 
    signInWithEmailAndPassword(auth, email, password)
      .then(cred => ({ success: true, index: i }))
      .catch(err => ({ success: false, error: err.message, index: i }))
  );
  
  const responses = await Promise.allSettled(promises);
  const endTime = Date.now();
  
  const successCount = responses.filter(r => r.status === 'fulfilled' && r.value.success).length;
  const failureCount = count - successCount;
  
  results.concurrentRequests.push({
    type: 'signIn',
    totalRequests: count,
    successCount,
    failureCount,
    totalDuration: endTime - startTime,
    averageDuration: (endTime - startTime) / count
  });
  
  console.log(`Concurrent sign-ins completed. Success: ${successCount}, Failed: ${failureCount}`);
  return { successCount, failureCount, totalDuration: endTime - startTime };
};

// Run multiple test users creation
const createTestUsers = async (count) => {
  console.log(`Creating ${count} test users...`);
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const email = generateRandomEmail();
    const password = `Password123!`;
    
    try {
      const result = await testSignUp(email, password);
      if (result.success) {
        users.push({ email, password });
        console.log(`Created user ${i+1}/${count}: ${email}`);
      } else {
        console.error(`Failed to create user ${i+1}/${count}: ${result.error}`);
      }
    } catch (error) {
      console.error(`Error creating user ${i+1}/${count}:`, error);
    }
  }
  
  console.log(`Created ${users.length} test users`);
  return users;
};

// Cleanup test users
const cleanupTestUsers = async (users) => {
  console.log(`Cleaning up ${users.length} test users...`);
  let deletedCount = 0;
  
  for (const {email, password} of users) {
    try {
      // Sign in first to get the user object
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await deleteUser(userCredential.user);
      deletedCount++;
    } catch (error) {
      console.error(`Error deleting user ${email}:`, error);
    }
  }
  
  console.log(`Deleted ${deletedCount}/${users.length} test users`);
};

// Run the complete stress test
const runFullStressTest = async () => {
  try {
    console.log('Starting Firebase Authentication Stress Test');
    
    // Test configuration
    const concurrentLevels = [1, 5, 10, 25, 50];
    const testUserCount = 10;
    
    // Create test users
    const users = await createTestUsers(testUserCount);
    if (users.length === 0) {
      console.error('Failed to create any test users. Aborting test.');
      return;
    }
    
    // Test single operations first
    console.log('\nTesting single operations...');
    for (let i = 0; i < Math.min(5, users.length); i++) {
      await testSignIn(users[i].email, users[i].password);
      await testPasswordReset(users[i].email);
    }
    
    // Test concurrent operations
    console.log('\nTesting concurrent operations...');
    for (const level of concurrentLevels) {
      if (level <= users.length) {
        await testConcurrentSignIns(level, users[0].email, users[0].password);
      }
    }
    
    // Save results to file
    const resultsData = JSON.stringify(results, null, 2);
    fs.writeFileSync('auth-stress-test-results.json', resultsData);
    console.log('\nTest results saved to auth-stress-test-results.json');
    
    // Generate summary
    console.log('\nTest Summary:');
    console.log(`Single Sign-Ins: ${results.signIn.length} tests, Avg time: ${
      results.signIn.reduce((sum, r) => sum + r.duration, 0) / results.signIn.length
    }ms`);
    
    console.log(`Single Sign-Ups: ${results.signUp.length} tests, Avg time: ${
      results.signUp.reduce((sum, r) => sum + r.duration, 0) / results.signUp.length
    }ms`);
    
    console.log(`Password Resets: ${results.passwordReset.length} tests, Avg time: ${
      results.passwordReset.reduce((sum, r) => sum + r.duration, 0) / results.passwordReset.length
    }ms`);
    
    // Clean up test users
    await cleanupTestUsers(users);
    
  } catch (error) {
    console.error('Error during stress test:', error);
  } 
};

// Run the test
runFullStressTest();