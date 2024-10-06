# Firebase Sample Usage

A simple guide on basic API calls for Firebase' Firestore and Storage

## Firestore

> [!NOTE]
> Replace "**collectionName**" with the type of data
> E.g. sentence for tiwi language data

### Query-ing

_a.k.a. filtering_

```typescript
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function query(item) {
    const itemRef = collection(db, "collectionName");
    const q = query(itemRef, where("itemID", "==", 1));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((i) => {
        console.log(i.data());
    });
}
```

### Adding Data

```typescript
import { db } from "@/firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export async function saveDataTest() {
    try {
        const docRef = await addDoc(collection(db, "collectionName"), {
            // fields here e.g. English: "hellow world"
        });

        console.log("Document written with ID:", docRef.id);
    } catch (e) {
        console.error("Error adding data:", e);
    }
}
```

### Reading Data

```typescript
export async function readDataTest() {
    try {
        const data = await getDocs(collection(db, "collectionName"));

        data.forEach((element) => {
            console.log(element.data());
        });
    } catch (e) {
        console.error("Error reading data:", e);
    }
}
```

### Modifying Data

```typescript
import { db } from "@/firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export async function updateDataTest(item) {
    try {
        const testRef = doc(db, "test", item.id);

        await updateDoc(testRef, {
            test2: 10,
        });
        console.log("success modifying");
    } catch (err) {
        console.error("failed modifying data", err);
    }
}
```

> [!TIP]
> Use query to get the id of the data to be modified

### Deleting Data

```typescript
export async function deleteDataTest(item) {
    try {
        const dataDocRef = doc(db, "test", item.id);
        await deleteDoc(dataDocRef);

        console.log("success deleting");
    } catch (err) {
        console.error("failed deleting data", err);
    }
}
```

> [!TIP]
> Use query to get the id of the data to be modified

More information on official [Firebase docs](https://firebase.google.com/docs/firestore)

## Storage

### Uploading

```typescript
// if you only have the uri/path to the file

export async function uploadFile(uri) {
    const response = await fetch(uri);
    const fileBlob = await response.blob();
    const filePath = `recording/${id}`;

    try {
        fileRef = ref(storage, filePath);
        await uploadBytes(fileRef, fileBlob);
        downloadURL = await getDownloadURL(fileRef);
    } catch (err) {
        console.error("Failed to upload file");
    }
}
```

More information on official [Firebase docs](https://firebase.google.com/docs/storage)
