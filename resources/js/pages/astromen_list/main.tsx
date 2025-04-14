import React, { Component } from 'react';
import { Head } from '@inertiajs/react';
import AstromenList from './astromenList';
import AddOrEditForm from './addOrEditForm';
import FlashMessages from './flashMessages';
import '../../../css/astromen.css';

export default class Main extends React.Component 
{
    constructor(props) {
        super(props);
    }

    render()
    {
        console.log(this.props);
        var oldFormValues = this.props.oldFormValues ?? null;
        return (
            <>				
                <Head title="Astronauti" />					
                <h1>Astronauti</h1>
                <FlashMessages oldFormValues={oldFormValues} message={this.props.flashStatus} backendValidatorErrors={this.props.errors} disableEvent={true} />
                <AstromenList list={this.props.astromen} />
                <AddOrEditForm csrf={this.props.csrf} aviableSkills={this.props.aviableSkills} action="edit" />
            </>
        );
    }

}
