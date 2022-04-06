import { ref } from 'vue'
import { auth } from '@/configs/firebase'
const error = ref(null)
const isPending = ref(false)

async function signup(email, password) {
    isPending.value = true;
    error.value = null;
    try {
        const response = await auth.createUserWithEmailAndPassword(email, password);
        if (!response) throw new Error("Could not create a new user")
        return response;
    } catch (error) {
        error.value = error.message;
    } finally {
        isPending.value = false;
    }
}

export function useSignUp() {
    return { error, isPending, signup }
}