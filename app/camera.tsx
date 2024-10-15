import { useRef, useState } from "react";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { View, StyleSheet, Button, Pressable } from "react-native";
import React from "react";
import { ImageBackground } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useSetPicChangedContext, useUserNameContext } from "@/contexts/UserContext";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/firebaseConfig";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as DocumentPicker from "expo-document-picker";

export default function Camera() {
    const primary = useThemeColor({}, "primary");

    const [facing, setFacing] = useState<CameraType>("front");
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUri, setPhotoUri] = useState<string>();
    const [didTake, setDidTake] = useState<boolean>(false);

    const cameraRef = useRef<CameraView | null>(null);
    const userName = useUserNameContext();
    const setPicChanged = useSetPicChangedContext();

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
        // todo error handle
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();

                if (!photo) {
                    throw new Error("Photo does not exist");
                }

                setDidTake(true);
                setPhotoUri(photo.uri);
            } catch (err) {
                console.error("Failed taking a picture", err);
                setDidTake(false);
            }
        }
    };

    const useDocumentPicker = async () => {
        try {
            const selected = await openDocumentPicker();
            if (selected) {
                setDidTake(true);
                setPhotoUri(selected);
            }
        } catch (error) {
            console.error("Failed uploading image from device");
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

            if (setPicChanged) {
                setPicChanged(photoUri);
            }

            router.navigate({ pathname: "/(profile)" });
        } catch (error) {
            console.error("Failed to save image to firebase");
        }
    };

    return (
        <View style={styles.mainView}>
            {didTake ? (
                <ImageBackground
                    source={{ uri: photoUri }}
                    style={styles.imageBackground}
                    resizeMode="cover"
                >
                    <View style={[styles.image__options, { backgroundColor: primary }]}>
                        <Pressable onPress={() => setDidTake(false)}>
                            <Ionicons name="repeat-sharp" size={50} color={"white"} />
                        </Pressable>
                        <Pressable onPress={() => saveImage()}>
                            <Ionicons name="checkmark-sharp" size={50} color={"white"} />
                        </Pressable>
                    </View>
                </ImageBackground>
            ) : (
                <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                    <View style={styles.camera__topOptions}>
                        <Pressable
                            style={{}}
                            onPress={() => router.navigate({ pathname: "/(profile)" })}
                        >
                            <Ionicons name="close-sharp" size={40} color={"white"} />
                        </Pressable>
                        <Pressable onPress={() => toggleCameraFacing()}>
                            <Ionicons name="camera-reverse-sharp" size={40} color={"white"} />
                        </Pressable>
                    </View>
                    <View style={styles.camera__bottonOptions}>
                        <Pressable onPress={() => useDocumentPicker()} style={{}}>
                            <Ionicons name="folder-open-sharp" size={40} color="white" />
                        </Pressable>
                        <Pressable onPress={() => takePicture()} style={styles.camera__shutter}>
                            <Ionicons name="ellipse-sharp" size={80} color="white" />
                        </Pressable>
                        <View style={{ width: 40 }}></View>
                    </View>
                </CameraView>
            )}
        </View>
    );
}

async function openDocumentPicker(): Promise<string | undefined> {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: "*/*",
            copyToCacheDirectory: true,
        });

        if (result.canceled) {
            throw new Error("Canceled by user");
        }

        return result.assets[0].uri;
    } catch (err) {
        console.error("Failed opening document picker", err);
    }
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: "black",
    },

    imageBackground: {
        height: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
    },

    image__options: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
        borderRadius: 30,
        gap: 40,
        paddingRight: "10%",
        paddingLeft: "10%",
    },

    camera: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
    },

    camera__shutter: {
        borderRadius: 75,
    },

    camera__bottonOptions: {
        flexDirection: "row",
        marginBottom: 20,
        justifyContent: "space-around",
        alignItems: "center",
    },

    camera__topOptions: {
        backgroundColor: "black",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
    },
});
