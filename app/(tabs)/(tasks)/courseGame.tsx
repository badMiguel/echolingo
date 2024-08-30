import { StyleSheet, View, Text } from "react-native";
import { DharugDataType, useDharugContext } from "./dharugProvider";

type CurrentType = {
    current: DharugDataType;
};

export default function CourseGame() {
    const current = useDharugContext();
    return (
        <>
            {current ? (
                <Question current={current} />
            ) : (
                <Text>Sorry does not exist</Text>
            )}
        </>
    );
}

function Question({ current }: CurrentType) {
    return (
        <View>
            {current.Dharug &&
                <>
                    <Text>Dharug:</Text>
                    <Text>{current.Dharug}</Text>
                </>
            }

            {current['Dharug(Gloss)'] &&
                <>
                    <Text>Dharug (Gloss):</Text>
                    <Text>{current['Dharug(Gloss)']}</Text>
                </>
            }
        </View>

    );
}

function Choices({ current }: CurrentType) {
    return (
        <View>
        </View>
    );
}

const styles = StyleSheet.create({
})
