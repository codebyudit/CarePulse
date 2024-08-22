'use server'

// import { ID, Query } from "node-appwrite";
import { Query , ID} from "node-appwrite";
// import {ID} from "../../node_modules/node-appwrite/dist/id";
import {BUCKET_ID, databases, ENDPOINT, NEXT_PUBLIC_DATABASE_ID, NEXT_PUBLIC_PATIENT_COLLECTION_ID, 
NEXT_PUBLIC_PROJECT_ID, storage, users} from "../appwrite.config"
import { parseStringify } from "../utils";
import { CreateUserParams, RegisterUserParams } from "@/types";
import {InputFile} from "node-appwrite/file";


export const createUser = async (user : CreateUserParams) => {
    // console.log({user});
    console.log("biii");
    try{
        const newUser = await users.create(ID.unique() , user.email , user.phone , undefined , user.name);
        console.log({newUser})
        console.log("User ID:", newUser.$id); // Log the user ID

        return parseStringify(newUser);
    }
    catch (error  : any){
        if(error && error?.code === 409) { 
            const documents = await users.list([
                Query.equal('email' , [user.email]),
            ])

            return documents?.users[0];
        }
        console.error("An error occurred while creating a new user:", error);


    }
}

export const getUser = async (userId : string) => {
    console.log("getUser function called with userId:", userId);

    try{
        const user = await users.get(userId);
        return parseStringify(user);
    }
    catch (error){
        console.error("An error occurred while getting a new user:", error);
    }
}


export const registerPatient = async ({identificationDocument , ...patient} : RegisterUserParams) => {
    console.log("reg pat in");
    try{
        let file;

        if(identificationDocument){
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string
            )

            file = await storage.createFile(BUCKET_ID! , ID.unique() , inputFile);
        }

        

        const newPatient  =  await databases.createDocument(
            NEXT_PUBLIC_DATABASE_ID!,
            NEXT_PUBLIC_PATIENT_COLLECTION_ID!,
            ID.unique(),
            {
                identificationDocument: file?.$id || null,
                identificationDocumentUrl:  `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${NEXT_PUBLIC_PROJECT_ID}`,
                ...patient
            }

        )

        return parseStringify(newPatient);
    }
    catch (error){
        console.error(error);
    }
}


export const getPatient = async (userId: string) => {
    try {
      const patients = await databases.listDocuments(
        NEXT_PUBLIC_DATABASE_ID!,
        NEXT_PUBLIC_PATIENT_COLLECTION_ID!,
        [Query.equal("userId", [userId])]
      );

      const patientDocument = patients.documents[0];
      if (!patientDocument) {
        throw new Error("Patient not found.");
    }
  
      return parseStringify(patients.documents[0]);
    } catch (error) {
      console.error(
        "An error occurred while retrieving the patient details:",
        error
      );
      return null;
    }
  };