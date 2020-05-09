import React from 'react';

import { Header } from './Layout';


interface HomeProps {
    Title: string
    Image: string
    Body: string
}

export const Home: React.FC<HomeProps> =
    (props: HomeProps) => (
        <Header Title={''} Image = "" Body=""></Header>
    );