import React, { Component } from 'react';
import { Head } from '@inertiajs/react';
import AstromenList from './astromenList';
import AddOrEditForm from './addOrEditForm';
import DeleteForm from './deleteForm';
import FlashMessages from './flashMessages';
import '../../../css/astromen.css';
import {astromen, simpleDial} from './types';

type propsType = {
     astromen: astromen|null,
     aviableSkills: simpleDial,
     csrf: string,
     oldFormValues: object|null, //object z session()->all()['_old_input']
     flashStatus: string|null,
     paginator: object, //object z Illuminate\Pagination\LengthAwarePaginator
     errors: object|null //chyby formularu, automaticky vlozeno backendem
};

export default class Main extends React.Component
{
    constructor(props: propsType) {
        super(props);
    }

    render()
    {
        const oldFormValues = this.props.oldFormValues ?? null;
        return (
            <>
                <Head title="Astronauti" />
                <h1>Astronauti</h1>
                <FlashMessages oldFormValues={oldFormValues} message={this.props.flashStatus} backendValidatorErrors={this.props.errors} disableEvent={true} />
                <AstromenList list={this.props.astromen} paginator={this.props.paginator} />
                <button type="button" onClick={() => {this.showNewAstromanForm();}}>Nový astronaut</button>
                <AddOrEditForm currentPage={this.props.paginator.current_page} csrf={this.props.csrf} aviableSkills={this.props.aviableSkills} action="edit" />
                <AddOrEditForm csrf={this.props.csrf} aviableSkills={this.props.aviableSkills} action="new" />
                <DeleteForm currentPage={this.props.paginator.current_page} csrf={this.props.csrf} />
            </>
        );
    }

    showNewAstromanForm()
    {
        const showNewAstromanFormEvent = new CustomEvent('showNewAstromanForm');
        document.dispatchEvent(showNewAstromanFormEvent);
        const unmarkRowEvent = new CustomEvent('unmarkRow');
        document.dispatchEvent(unmarkRowEvent);
        const hideDeleteAstromanFormEvent = new CustomEvent('hideDeleteAstromanForm');
        document.dispatchEvent(hideDeleteAstromanFormEvent);
    }

}
