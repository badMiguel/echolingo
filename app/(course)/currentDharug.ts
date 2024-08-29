import dharugData from '../../data/json/dharug_list.json'
import courseData from '../../data/json/course_data.json'
import { useLocalSearchParams } from 'expo-router';
import { useDharugContext } from './courseProvider';

export type DharugDataType = {
    id: number;
    English: string | null;
    "Gloss (english)": string | null;
    "Dharug(Gloss)": string | null;
    Dharug: string | null;
    Topic: string | null;
    "Image Name (optional)": string | null;
    recording: string | null;
    completed: boolean;
};

export default function currentDharug(): DharugDataType | null {
    const dharugList: DharugDataType[] = filterDharug();

    const current: DharugDataType | null = dharugList.length > 0
        ? dharugList[0] : null;

    return current;
}

function filterDharug(): DharugDataType[] {
    const courseName = useDharugContext().course;

    const selectedCourse = courseData.filter(course => course.courseName === courseName);
    return dharugData.filter(item =>
        selectedCourse.some(course => course.topic.includes(item.Topic)) &&
        !item.completed
    );
}
