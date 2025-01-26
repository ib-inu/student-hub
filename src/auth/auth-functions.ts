/* eslint-disable @typescript-eslint/no-unused-vars */

import toast from 'react-hot-toast';
import { signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

import { auth } from "../firebase/firebase";

export const signUp = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // console.log('User signed up:', userCredential.user);
        toast.success('User signed up successfully!');
    } catch (error) {
        toast.error('Failed to sign up.');
    }
};

export const signIn = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // console.log('User signed in:', userCredential.user);
        toast.success('User signed in successfully!');
    } catch (error) {
        // console.error('Error signing in:', error);
        toast.error('Failed to sign in.');
    }
};

export const signOutUser = async () => {
    try {
        await signOut(auth);
        // console.log('User signed out');
        toast.success('signed out successfully .', {
            style: {
                border: '1px solid #713200',
                padding: '16px',
                color: '#713200',
            },
            iconTheme: {
                primary: '#713200',
                secondary: '#FFFAEE',
            },
        });
    } catch (error) {
        // console.error('Error signing out:', error);
        toast.error('Failed to sign out.');
    }
};

