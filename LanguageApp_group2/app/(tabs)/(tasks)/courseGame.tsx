import { StyleSheet, View, Text } from "react-native";
import { useDharugListContext } from "@/contexts/DharugContext"; // Use the context here
import { DataType } from "@/contexts/DharugContext";

export default function CourseGame() {
  const dharugList = useDharugListContext(); // Get the list from the context
  const current: DataType | undefined = dharugList?.[0]; // Here we just take the first item for demo purposes

  return (
    <>
      {current ? (
        <Question current={current} />
      ) : (
        <Text>Sorry, no data available</Text>
      )}
    </>
  );
}

type CurrentType = {
    current: DataType;
};

function Question({ current }: {current: DataType}) {
    return (
        <View>
            {current.Dharug ? 
                <>
                    <Text>Dharug:</Text>
                    <Text>{current.Dharug}</Text>
                </> : null
            }

            {current['Dharug(Gloss)'] ? 
                <>
                    <Text>Dharug (Gloss):</Text>
                    <Text>{current['Dharug(Gloss)']}</Text>
                </> : null
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
