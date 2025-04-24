import React, { Component } from 'react';
import SkillFieldForForm from './skillFieldForForm';
import AddOrEditFormValidator from './addOrEditFormValidator';
import FormErrors from './formErrors';
import {astromenRow, simpleDial} from './types';

type addOrEditForPropsType = {
     currentPage: number|null,
     aviableSkills: simpleDial,
     csrf: string,
     action: 'edit'|'new'
};

/**
 * events:
 *    astromanFormEditSetData: detail = {data: astromenRow}
 *    showNewAstromanForm
 *    hideNewAstromanAndEditForm
 */
export default class AddOrEditForm extends React.Component
{
    constructor(props: addOrEditForPropsType) {
        super(props);
        this.state = {
            data: {
                first_name: '',
                last_name: '',
                DOB: '',
                skills: []
            },
            show: false
        };

        if (props.action !== 'edit' && props.action !== 'new') {
            throw new Error('props.action must be edit or new');
        }
    }

    render()
    {

        if (!this.state.show) {
            return (
                <>
                </>
            );
        }

        const action = '/' + this.props.action;
        const id = this.props.action === 'edit' ? this.state.data.id : 0;
        const formTitle = this.props.action === 'edit' ? `Editace astronauta ${this.state.data.first_name} ${this.state.data.last_name}` : 'Nový astronaut';

        let formMethod = '';
        if (this.props.action === 'edit') {
            formMethod = <input type="hidden" name="_method" value="PUT" />;
        }

        return (
            <>
                <h2>{formTitle}</h2>
                <FormErrors disableEvent={false} action={this.props.action} errors={[]} />
                <form action={action} onSubmit={(event) => {this.validateForm(event)}} method="POST">
                    <input type="hidden" name="_token" value={this.props.csrf} />
                    {formMethod}
                    <input type="hidden" name="id" value={id} />
                    <input type="hidden" name="page" value={this.props.currentPage} />
                    <input type="hidden" name="action" value={this.props.action} />
                    <table>
                        <tbody>
                            <TabledInput label="Jméno" type="text" name="first_name" inputValue={this.state.data.first_name} />
                            <TabledInput label="Příjmení" type="text" name="last_name" inputValue={this.state.data.last_name} />
                            <TabledInput label="Datum narození" type="date" name="DOB" inputValue={this.state.data.DOB} />
                            <SkillFieldForForm aviableSkills={this.props.aviableSkills} data={this.state.data.skills} />
                            <tr>
                                <th></th>
                                <td className="tabled_buttons">
                                    <input type="submit" name="sent" value="Odeslat" />
                                    <button type="button" onClick={() => {this.cancel();}}>Zrušit</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </>
        );
    }

    componentDidMount()
    {
        document.addEventListener('astromanFormEditSetData', (event) => {
            if (this.props.action === 'edit') {
                const removeAstromanExtraSkillsEvent = new CustomEvent('removeAstromanExtraSkills');
                document.dispatchEvent(removeAstromanExtraSkillsEvent);
                this.setState({data: event.detail.data, show: true});
            } else if (this.props.action === 'new') {
                this.setState({show: false});
            }
        });
        document.addEventListener('showNewAstromanForm', () => {
            if (this.props.action === 'new') {
                this.setState({show: true});
            } else if (this.props.action === 'edit') {
                this.setState({show: false});
            }
        });
        document.addEventListener('hideNewAstromanAndEditForm', () => {
            this.setState({show: false});
        });
    }

    cancel()
    {
        this.setState({show: false});
        const unmarkRowEvent = new CustomEvent('unmarkRow');
        document.dispatchEvent(unmarkRowEvent);
    }

    validateForm(e)
    {
        e.preventDefault();
        const addOrEditFormValidator = new AddOrEditFormValidator();
        addOrEditFormValidator.validate(event.target)
            .then((validateErrors) => {
                if (validateErrors.length === 0) {
                    e.target.submit();
                } else {
                    const setFormErrorsEvent = new CustomEvent('setFormErrors', {
                            detail: {
                                action: this.props.action,
                                errors: validateErrors
                        }
                    });
                    document.dispatchEvent(setFormErrorsEvent);
                }
            })
        ;
    }

}

type tabledInputPropsType = {
     inputValue: number|string,
     label: string,
     type: string,
     name: string,
     extraAttributes: object|null
};

class TabledInput extends React.Component
{
    constructor(props: tabledInputPropsType)
    {
        super(props);
        this.state = {
            value: props.inputValue || ''
        };
    }

    componentDidUpdate(prevProps)
    {
        if (prevProps.inputValue !== this.props.inputValue) {
            this.setState({ value: this.props.inputValue });
        }
    }

    handleChange(e)
    {
        this.setState({ value: e.target.value });
    };

    render()
    {
        return (
            <tr>
                <th>{this.props.label}</th>
                <td className="tabled_input">
                    <input
                        type={this.props.type}
                        name={this.props.name}
                        value={this.state.value}
                        onChange={(e) => {this.handleChange(e);}}
                        {...this.props.extraAttributes}
                    />
                </td>
            </tr>
        );
    }

}
