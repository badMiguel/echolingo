import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Text, Alert } from "react-native";
import useRecording from "@/hooks/recording/useRecording";
import AudioPlayback from "@/components/audio/playback";
import useCRUD from "@/hooks/data/useCRUD";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "@/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Button, Snackbar } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { useTiwiContext } from "@/contexts/TiwiContext";

export default function RecordView() {
    const bgColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const primary_tint = useThemeColor({}, "primary_tint");

    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);

    const getShow = (show: boolean) => {
        setShow(show);
    };
    const getIsSuccess = (success: boolean) => {
        setIsSuccess(success);
    };

    return (
        <View style={[styles.mainView, { backgroundColor: bgColor }]}>
            <View style={styles.record}>
                <Record passShow={getShow} passIsSuccess={getIsSuccess} />
            </View>
            <View style={[styles.notif__view, { opacity: show ? 1 : 0 }]}>
                <Text
                    style={[
                        styles.notif__text,
                        { backgroundColor: primary_tint, color: textColor },
                    ]}
                >
                    {isSuccess ? "Recording successfully saved" : "Failed to save recording"}
                </Text>
            </View>
        </View>
    );
}

export function Record({
    fromStudent,
    passShow,
    passIsSuccess,
}: {
    fromStudent?: boolean;
    passShow?: (show: boolean) => void;
    passIsSuccess?: (success: boolean) => void;
}) {
    const bgColor = useThemeColor({}, "background");
    const primary = useThemeColor({}, "primary");
    const primary_tint = useThemeColor({}, "primary_tint");

    const [loaded, setLoaded] = useState<boolean>(false);
    const [changed, setChanged] = useState<boolean>(false);

    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [tempUri, setTempUri] = useState<string | undefined | null>();
    const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);

    const { startRecording, stopRecording, recording, uri, haveRecording } = useRecording();
    const { saveRecording } = useCRUD();
    const { id } = useLocalSearchParams();
    const currentID: string = Array.isArray(id) ? id[0] : id;
    const current = useTiwiContext();

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                if (recording) {
                    stopRecording();
                }
            };
        }, [recording])
    );

    useEffect(() => {
        if (current) {
            setTempUri(current.recording);
            setLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (loaded) {
            setTempUri(uri);
            setChanged(true);
        }
    }, [uri]);

    useEffect(() => {
        if (passShow && passIsSuccess) {
            passShow(show);
            passIsSuccess(isSuccess);
        }
    }, [isSuccess, show]);

    useEffect(() => {
        if (!recording && isSuccess) {
            setIsSuccess(false);
        }
    }, [recording]);

    const useDocumentPicker = async () => {
        const uploadedUri = await openDocumentPicker();
        setTempUri(uploadedUri);
        setIsSuccess(false);
        setChanged(true);
    };

    const save = async () => {
        setIsSuccess(false);
        if (typeof tempUri === "string") {
            setTempUri(undefined);
            setIsLoading(true);

            const startTime = performance.now();
            const status = await saveRecording(tempUri, currentID);
            const endTime = performance.now();

            // avoid upload spam
            const uploadTime = endTime - startTime;
            if (uploadTime < 3000 && status.status) {
                await new Promise((resolve) => setTimeout(resolve, 3000 - uploadTime));
            }

            setIsLoading(false);
            setTempUri(status.filePath); // recording removed from original temp storage
            setIsSuccess(status.status);
        }

        setShow(true);
        setTimeout(() => {
            setShow(false);
        }, 3000);
    };

    const submit = async () => {
        if (!tempUri) {
            Alert.alert("Error", "No recording available to submit.");
            return;
        }

        try {
            console.log("Submitting recording with URI:", tempUri);

            // upl recording to firebase
            const storageRef = ref(storage, `submissions/${currentID}/${Date.now()}.mp3`);
            const response = await fetch(tempUri);
            const blob = await response.blob();
            console.log("Uploading recording...");
            setIsLoading(true);
            await uploadBytes(storageRef, blob);

            // download URL of the uploaded recording
            const downloadUrl = await getDownloadURL(storageRef);
            setIsLoading(false);
            console.log("Recording uploaded successfully, download URL:", downloadUrl);

            setSnackbarVisible(true);
            console.log(snackbarVisible);
            // save submission
            await addDoc(collection(db, "submissions"), {
                sentenceId: currentID,
                category: "casual_study",
                recordingUrl: downloadUrl,
                submittedAt: new Date(),
            });

            // setIsSuccess(true);
            // setShow(true);

            // setTimeout(() => {
            //     setShow(false);
            // }, 3000);
        } catch (error) {
            console.error("Error submitting recording:", error);
            Alert.alert("Error", "There was an error submitting the recording.");
        }
    };

    return (
        <View>
            <AudioPlayback uri={tempUri} />
            {!fromStudent && (
                <Pressable
                    onPress={() => save()}
                    disabled={!tempUri || isLoading || isSuccess || !changed ? true : undefined}
                    style={[
                        styles.button,
                        {
                            backgroundColor:
                                !tempUri || isLoading || isSuccess || !changed
                                    ? primary_tint
                                    : primary,
                        },
                    ]}
                >
                    <ThemedText
                        type="defaultSemiBold"
                        style={[
                            styles.button__text,
                            {
                                color:
                                    !tempUri || isLoading || isSuccess || !changed
                                        ? primary
                                        : bgColor,
                            },
                        ]}
                    >
                        {isLoading ? "Loading" : "Save"}
                    </ThemedText>
                </Pressable>
            )}
            <Pressable
                onPress={recording ? stopRecording : startRecording}
                disabled={isLoading ? true : undefined}
                style={[styles.button, { backgroundColor: isLoading ? primary_tint : primary }]}
            >
                <ThemedText
                    type="defaultSemiBold"
                    style={[styles.button__text, { color: isLoading ? primary : bgColor }]}
                >
                    {recording
                        ? "Stop Recording"
                        : haveRecording
                          ? "Record Another"
                          : "Start Recording"}
                </ThemedText>
            </Pressable>

            {fromStudent ? (
                <Button
                    mode="contained"
                    onPress={submit}
                    disabled={!haveRecording}
                    style={[
                        styles.submit__button,
                        { backgroundColor: haveRecording ? primary : "#ddd" },
                    ]}
                    contentStyle={{ paddingVertical: 10 }}
                    labelStyle={{ color: haveRecording ? bgColor : "#aaa" }}
                >
                    <ThemedText
                        type="defaultSemiBold"
                        style={[
                            styles.button__text,
                            {
                                color: haveRecording ? bgColor : "#aaa",
                            },
                        ]}
                    >
                        Submit
                    </ThemedText>
                </Button>
            ) : (
                <Pressable
                    style={[styles.button, { backgroundColor: isLoading ? primary_tint : primary }]}
                    onPress={() => useDocumentPicker()}
                    disabled={isLoading ? true : false}
                >
                    <ThemedText
                        type="defaultSemiBold"
                        style={{ color: isLoading ? primary : bgColor }}
                    >
                        {isSuccess ? "Upload Another From Device" : "Upload From Device"}
                    </ThemedText>
                </Pressable>
            )}

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={5000}
                style={styles.snackbar}
            >
                Submission successfully saved!
            </Snackbar>
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
        paddingLeft: 30,
        paddingRight: 30,
    },

    record: {
        flex: 2,
        justifyContent: "center",
    },

    notif__view: {
        justifyContent: "flex-end",
        marginBottom: 20,
    },

    notif__text: {
        alignSelf: "flex-start",
        textAlign: "center",
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        fontSize: 18,
    },

    button: {
        alignItems: "center",
        borderRadius: 10,
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 10,
    },

    button__text: {
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 7,
        paddingBottom: 5,
        borderRadius: 10,
    },

    submit__button: {
        // position: 'absolute',
        // bottom: -130,
        // right: 0,
        borderRadius: 10,
        // paddingVertical: 10,
        // paddingHorizontal: 20,
        alignItems: "center",
        // marginVertical: 10,
    },

    snackbar: {
        // position: 'absolute',
        bottom: -160,
        left: 0,
        right: 0,
        color: "#fff",
        borderRadius: 5,
        padding: 10,
        margin: 0,
    },
    submit_func: {
        flex: 1,
        justifyContent: "space-between",
    },
});
