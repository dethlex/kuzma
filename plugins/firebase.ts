import {initializeApp} from "firebase/app";
// import {getAuth} from "@firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai-preview";

export default defineNuxtPlugin(async () => {
    const {firebase: cfg} = useRuntimeConfig().public


    const app = initializeApp(cfg);
    // const auth = getAuth(app);
    const firestore = getFirestore(app);
    const storage = getStorage(app)

    // const eventID = ref('0')

    // Initialize the Vertex AI service
    const vertexAI = getVertexAI(app);

// Initialize the generative model with a model that supports your use case
// Gemini 1.5 models are versatile and can be used with all API capabilities
    const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

    // await auth.authStateReady()

    // const user = ref(auth.currentUser);

    // auth.onAuthStateChanged((newUser) => {
    //     user.value = newUser
    // })

    return {
        provide: {
            app,
            // auth,
            // user,
            firestore,
            storage,
            // eventID,
            model
        }
    }
})
