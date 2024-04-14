import { Account, Avatars, Client, ID } from 'react-native-appwrite';
import SignIn from '../app/(auth)/sign-in';


export const  config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.santosh.aora',
    projectId: '661a56027382f0f72956',
    databaseId: '661a5878ba3baa21cc2b',
    userCollectionId: '661a58ba720715154500',
    videoCollectionId: '661a5918ee22edc12fed',
    storageId: '661a5c086b6252615744'
}


// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) 
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.


const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createuser = async (email, password, username) => {
    try{
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await SignIn(email, password);
        const newUser = await databases.createDocuments(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )
        return newUser;


    } catch(error) {
        console.log(error);
        throw new Error(error);
    }
}

export const signIn= async (email, password) => {
    try{
        const session = await account.createEmailSession(email, password)

        return session;
    } catch(error){
        throw new Error(error);
    }
}


// Get Current User
export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }


