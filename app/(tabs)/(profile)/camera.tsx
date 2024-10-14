import { useRef, useState } from "react";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { View, StyleSheet, Button, Pressable } from "react-native";
import React from "react";
import { ImageBackground } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useUserNameContext } from "@/contexts/UserContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/firebaseConfig";
import { router } from "expo-router";

export default function Camera() {
    const userName = useUserNameContext();

    const [facing, setFacing] = useState<CameraType>("front");
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUri, setPhotoUri] = useState<string>();
    const [didTake, setDidTake] = useState<boolean>(false);
    const cameraRef = useRef<CameraView | null>(null);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={{}}>
                <ThemedText style={{}}>We need your permission to show the camera</ThemedText>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing((current) => (current === "back" ? "front" : "back"));
    };

    const takePicture = async () => {
        setDidTake(true);

        // todo error handle
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();

                if (!photo) {
                    throw new Error("Photo does not exist");
                }

                setPhotoUri(photo.uri);
            } catch (err) {
                console.error("Failed taking a picture", err);
                setDidTake(false);
            }
        }
    };

    const saveImage = async () => {
        try {
            if (!photoUri) {
                throw new Error("Image uri does not exist");
            }
            const response = await fetch(photoUri);
            const imageBlob = await response.blob();

            const filePath = `profilePic/${userName}`;
            const fileRef = ref(storage, filePath);
            if (!fileRef) {
                throw new Error("Failed to get reference of image");
            }

            await uploadBytes(fileRef, imageBlob);
            const downloadURL = await getDownloadURL(fileRef);

            if (!downloadURL) {
                throw new Error("Failed to get download url of recording");
            }

            router.navigate({ pathname: "/(profile)" });
        } catch (error) {
            console.error("Failed to save image to firebase");
        }
    };

    return (
        <>
            {didTake ? (
                <View style={{ flex: 1 }}>
                    <ImageBackground
                        source={{ uri: photoUri }}
                        style={{
                            height: "100%",
                        }}
                        resizeMode="cover"
                    >
                        <Pressable onPress={() => setDidTake(false)}>
                            <ThemedText style={{ color: "pink" }}>Take Another</ThemedText>
                        </Pressable>
                        <Pressable onPress={() => saveImage()}>
                            <ThemedText style={{ color: "pink" }}>Save</ThemedText>
                        </Pressable>
                    </ImageBackground>
                </View>
            ) : (
                <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                    <View style={{}}>
                        <Pressable style={{}} onPress={toggleCameraFacing}>
                            <ThemedText style={{}}>Flip Camera</ThemedText>
                        </Pressable>
                        <Pressable onPress={takePicture}>
                            <ThemedText>Take Pic</ThemedText>
                        </Pressable>
                    </View>
                </CameraView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    },
});
