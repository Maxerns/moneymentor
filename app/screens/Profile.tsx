import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, ActivityIndicator } from 'react-native';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#00ADB5" />;
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>No user is logged in.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image
                style={styles.profileImage}
                source={{ uri: user.photoURL || 'https://example.com/profile.jpg' }}
            />
            <Text style={styles.name}>{user.displayName || 'John Doe'}</Text>
            <Text style={styles.email}>{user.email || 'john.doe@example.com'}</Text>
            <Button title="Edit Profile" onPress={() => { /* Handle edit profile */ }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    email: {
        fontSize: 18,
        color: 'gray',
        marginBottom: 20,
    },
    message: {
        fontSize: 18,
        color: 'gray',
    },
});

export default Profile;