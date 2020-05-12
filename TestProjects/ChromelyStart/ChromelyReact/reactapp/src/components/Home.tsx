import React from 'react';
import { Header } from './Layout';
import {Body} from './Body'


interface HomeProps {
    Title: string
    Image: string
    Body: string
}

export const Home: React.FC<HomeProps> =
    (props: HomeProps) => (
        <React.Fragment>
            <Header Title={''}></Header>
            <Body></Body>
        </React.Fragment>
    );