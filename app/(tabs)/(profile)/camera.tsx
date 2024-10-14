import { useState } from "react";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { View, Text, Button, Pressable } from "react-native";
import React from "react";

export default function Camera() {
    const [facing, setFacing] = useState<CameraType>("front");
    const [permission, requestPermission] = useCameraPermissions();

    const initiateCamera = () => {
        if (!permission) {
            // Camera permissions are still loading.
            return <View />;
        }

        if (!permission.granted) {
            // Camera permissions are not granted yet.
            return (
                <View style={{}}>
                    <Text style={{}}>We need your permission to show the camera</Text>
                    <Button onPress={requestPermission} title="grant permission" />
                </View>
            );
        }

        function toggleCameraFacing() {
            setFacing((current) => (current === "back" ? "front" : "back"));
        }

        return (
            <View style={{}}>
                <CameraView style={{}} facing={facing}>
                    <View style={{}}>
                        <Pressable style={{}} onPress={toggleCameraFacing}>
                            <Text style={{}}>Flip Camera</Text>
                        </Pressable>
                    </View>
                </CameraView>
            </View>
        );
    };
}
