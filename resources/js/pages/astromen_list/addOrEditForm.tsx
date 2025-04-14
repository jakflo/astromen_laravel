import React, { Component } from 'react';
import SkillFieldForForm from './skillFieldForForm';
import AddOrEditFormValidator from './addOrEditFormValidator';
import FormErrors from './formErrors';

export default class AddOrEditForm extends React.Component
{
    constructor(props) {
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

        var action = '/' + this.props.action;
        var id = this.props.action === 'edit' ? this.state.data.id : 0;
        var formTitle = this.props.action === 'edit' ? `Editace astronauta ${this.state.data.first_name} ${this.state.data.last_name}` : 'Nový astronaut';

        return (
            <>
                <h2>{formTitle}</h2>
                <FormErrors disableEvent={false} action={this.props.action} errors={[]} />
                <form action={action} onSubmit={(event) => {this.validateForm(event)}} method="POST">
                    <input type="hidden" name="_token" value={this.props.csrf} />
                    <input type="hidden" name="id" value={id} />
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
                                    <button type="button">Zrušit</button>
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
        var toto = this;
        document.addEventListener('astromanFormEditSetData', function(event) {
            if (toto.props.action === 'edit') {
                var removeAstromanExtraSkillsEvent = new CustomEvent('removeAstromanExtraSkills');
                document.dispatchEvent(removeAstromanExtraSkillsEvent);
                toto.setState({data: event.detail.data, show: true});
            } else if (toto.props.action === 'new') {
                toto.setState({show: false});
            }
        });
        document.addEventListener('showNewAstromanForm', function(event) {
            if (toto.props.action === 'new') {
                toto.setState({show: true});
            } else if (toto.props.action === 'edit') {
                toto.setState({show: false});
            }
        });
    }
    
    validateForm(e)
    {
        var toto = this;
        e.preventDefault();
        var addOrEditFormValidator = new AddOrEditFormValidator();
        addOrEditFormValidator.validate(event.target)
            .then((validateErrors) => {
                if (validateErrors.length === 0) {
                    e.target.submit();
                } else {
                    var setFormErrorsEvent = new CustomEvent('setFormErrors', {
                            detail: {
                                action: toto.props.action, 
                                errors: validateErrors
                        }
                    });
                    document.dispatchEvent(setFormErrorsEvent);
                }
            })
        ;
    }
    
}

class TabledInput extends React.Component 
{
    constructor(props) 
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
                        {...this.props.extaAttributes}
                    />
                </td>
            </tr>
        );
    }
    
}
