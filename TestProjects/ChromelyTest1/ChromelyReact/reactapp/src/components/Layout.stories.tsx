import React from 'react';
import { Header } from './Layout';  

export default {
    title: 'Components/Layout',
    component: Header,
    // Our exports that end in "Data" are not stories.
    excludeStories: /.*Data$/,
};
export const title = () => <Header Title={"Monkeys"}></Header>;

