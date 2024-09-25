import { Image, Pressable, SectionList, StyleSheet, View } from 'react-native'
import categoryData from '@/data/json/category_data.json';
import React from 'react'
import images from '@/constants/images';
import { router } from 'expo-router';
import { useSetCategoryContext } from '@/contexts/CategoryContext';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

type CategoryCardProps = {
    categoryName: string,
    categoryImgSrc: any,
};

const colors = () => {
    return {
        bgColor: useThemeColor({}, 'background'),
        buttonColor: useThemeColor({}, 'tint'),
        textColor: useThemeColor({}, 'text'),
        accent: useThemeColor({}, 'accent'),
        tint: useThemeColor({}, 'tint'),
    }
}

export default function Tasks() {
    const color = colors();

    // todo optimisation
    const unfinished = categoryData.filter(item => !item.completed);
    const finished = categoryData.filter(item => item.completed);

    const empty = (is_finished: boolean) => {
        return {
            categoryNum: 0,
            categoryName: '',
            completed: is_finished,
        }
    }

    const sections = [
        {
            title: "Unfinished Categories",
            data: unfinished.length > 0 ? unfinished : [empty(false)],
        },
        {
            title: "Finished Categories",
            data: finished.length > 0 ? finished : [empty(true)],
        },
    ]

    return (
        <View style={{ flex: 1, backgroundColor: color.bgColor }}>
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.categoryName}
                renderItem={({ item }) =>
                    item.categoryName === '' ? (
                        !item.completed ? (
                            <ThemedText type='default' style={[styles.emptySection, { color: color.textColor }]}>Congratulations! You have finished categories currently available.</ThemedText>
                        ) : (
                            <ThemedText type='default' style={[styles.emptySection, { color: color.textColor }]}>You currently have not finished any category yet.</ThemedText>
                        )
                    ) : (
                        <CategoryCard
                            categoryName={item.categoryName}
                            categoryImgSrc={images[item.categoryName]}
                        />
                    )
                }
                renderSectionHeader={({ section: { title } }) => (
                    <ThemedText type='subtitle' style={[styles.tasks__header, { color: color.textColor }]}>{title}</ThemedText>
                )}
                style={styles.tasks}
            />34wesxzc543rt
        </View>
    )
}

function CategoryCard({ categoryName, categoryImgSrc }: CategoryCardProps) {
    const color = colors();
    const setCategory = useSetCategoryContext();

    const goToCategory = (categoryName: string) => {
        setCategory(categoryName);
        router.push({
            pathname: '/category',
        })
    };

    return (
        <View style={[styles.categoryCard, { backgroundColor: color.accent }]}>
            <View style={[styles.categoryCard__label__container, { backgroundColor: color.accent }]}>
                <View style={styles.categoryCard__label}>
                    <ThemedText type='subtitle'>{categoryName}</ThemedText>
                </View>
                <View style={styles.button__container}>
                    <Pressable
                        onPress={() => goToCategory(categoryName)}
                        style={[
                            styles.button,
                            { backgroundColor: color.tint }
                        ]}>
                        <ThemedText type='defaultSemiBold' style={{ color: color.bgColor }}>Start Now</ThemedText>
                    </Pressable>
                </View>
            </View>
            <View style={styles.categoryCard__imageContainer}>
                <Image
                    style={styles.categoryCard__image}
                    source={categoryImgSrc} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    tasks: {
        flexDirection: 'column',
        paddingRight: 20,
        paddingLeft: 20
    },

    tasks__header: {
        marginTop: 20,
        marginBottom: 30,
    },

    emptySection: {
        marginBottom: 30,
    },

    categoryCard: {
        flexDirection: 'row',
        maxHeight: 170,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
    },

    categoryCard__label: {
        flex: 1,
    },

    categoryCard__label__container: {
        flex: 1.5,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'space-around',
    },

    categoryCard__imageContainer: {
        flex: 1.7,
        overflow: 'hidden',
    },

    categoryCard__image: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
    },

    button: {
        alignSelf: 'flex-start',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 5,
        paddingTop: 5,
        borderRadius: 10,
        flexShrink: 1,
    },

    button__container: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'flex-end',
        margin: 10,
    }
})
