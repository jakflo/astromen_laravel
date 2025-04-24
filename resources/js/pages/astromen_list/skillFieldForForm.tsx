import React, { Component } from 'react';
import {simpleDial} from './types';

type skillFieldForFormPropsType = {
     aviableSkills: simpleDial,
     data: simpleDial
};

/**
 * events:
 *    astromanFormRemoveSkill: detail = {id: number}
 *    removeAstromanExtraSkills
 */
export default class SkillFieldForForm extends React.Component
{
    constructor(props: skillFieldForFormPropsType) {
        super(props);
        this.state = {
            extraItems: []
        };
        this.newItemCounter = 1;
    }

    render()
    {
        return (
            <>
                <tr>
                    <th>Dovednosti</th>
                    <td className="tabled_input">
                        <ul className="no-bullets">
                            {this.loadItems()}
                        </ul>
                        <button type="button" onClick={() => {this.selectNewSkill()}}>Přidat dovednost</button>
                        <button type="button" onClick={() => {this.createAndAddNewSkill();}}>Vytvořit a přidat novou dovednost</button>
                    </td>
                </tr>
            </>
        );
    }

    componentDidMount()
    {
        document.addEventListener('astromanFormRemoveSkill', (event) => {
            this.removeNewAddedSkill(event.detail.id);
        });
        document.addEventListener('removeAstromanExtraSkills', () => {
            this.setState({extraItems: []});
        });
    }

    loadItems()
    {
        const items = [];
        let k;
        for (k in this.props.data) {
            const skillItem = this.props.data[k];
            items.push(<SkillCheckbox key={skillItem.id} skillItem={skillItem} />);
        }

        return items.concat(this.state.extraItems);
    }

    isPropsChanged()
    {
        if (this.props.data.length !== this.state.items.length) {
            return true;
        }

        let k;
        for (k in this.props.data) {
            const propItem = this.props.data[k];
            const oldPropItem = this.oldProps.data[k];
            if (propItem.id !== oldPropItem.id || propItem.name !== oldPropItem.name) {
                return true;
            }
        }

        return false;
    }

    createAndAddNewSkill()
    {
        const extraItems = this.state.extraItems;
        const keyName = "nsf" + this.newItemCounter;
        extraItems.push(<SkillInput idKey={this.newItemCounter} key={keyName} keyName={keyName} />);
        this.setState({extraItems: extraItems});
        this.newItemCounter++;
    }

    selectNewSkill()
    {
        const extraItems = this.state.extraItems;
        const keyName = "ssf" + this.newItemCounter;
        extraItems.push(<SkillSelect idKey={this.newItemCounter} aviableSkills={this.props.aviableSkills} key={keyName} keyName={keyName} />);
        this.setState({extraItems: extraItems});
        this.newItemCounter++;
    }

    removeNewAddedSkill(keyName)
    {
        const extraItems = this.state.extraItems;

        let k;
        let keyFound = false;
        for (k in extraItems) {
            if (extraItems[k].key === keyName) {
                keyFound = true;
                break;
            }
        }

        if (!keyFound) {
            throw new Error('keyname not found');
        } else {
            extraItems.splice(k, 1);
            this.setState({extraItems: extraItems});
        }
    }

}

type skillCheckboxPropsType = {
     skillItem: {
         id: number,
         name: string
     }
};

class SkillCheckbox extends React.Component
{
    constructor(props: skillCheckboxPropsType) {
        super(props);
        this.state = {
            data: this.props.skillItem
        };
    }

    render()
    {
        const skillLabelId = 'skill_item_' + this.state.data.id;
        const formName = "skill[" + this.state.data.id + "]";
        return (
            <>
                <li>
                    <label htmlFor={skillLabelId}>{this.state.data.name}</label>
                    <input id={skillLabelId} type="checkbox" name={formName} defaultChecked onChange={this.noop} />
                </li>
            </>
        );
    }

    noop()
    {

    }

}

type skillInputPropsType = {
     idKey: number,
     keyName: string
};

class SkillInput extends React.Component
{
    constructor(props: skillInputPropsType) {
        super(props);
    }

    render()
    {
        const idName = "new_id" + this.props.idKey;
        const formName = "skill[" + idName + "]";

        return (
            <>
                <li>
                    <input type="text" name={formName} />
                    <button type="button" data-id={this.props.idKey} onClick={() => {this.removeMyself();}}>Zrušit</button>
                </li>
            </>
        );
    }

    removeMyself()
    {
        const skillEvent = new CustomEvent('astromanFormRemoveSkill', {detail:{id: this.props.keyName}});
        document.dispatchEvent(skillEvent);
    }

}

type skillSelectPropsType = {
    idKey: number,
    keyName: string,
    aviableSkills: simpleDial
};

class SkillSelect extends React.Component
{
    constructor(props: skillSelectPropsType) {
        super(props);
    }

    render()
    {
        const idName = "selected_id" + this.props.idKey;
        const formName = "skill[" + idName + "]";

        const selectOptions = [<option key="sso0" value="0">---Vybetre dovednost---</option>];
        this.props.aviableSkills.forEach((skillItem) => {
            const keyName = "sso" + skillItem.id;
            selectOptions.push(<option key={keyName} value={skillItem.id}>{skillItem.name}</option>);
        });

        return (
            <>
                <li>
                    <select name={formName}>{selectOptions}</select>
                    <button type="button" data-id={this.props.idKey} onClick={() => {this.removeMyself();}}>Zrušit</button>
                </li>
            </>
        );
    }

    removeMyself()
    {
        const skillEvent = new CustomEvent('astromanFormRemoveSkill', {detail:{id: this.props.keyName}});
        document.dispatchEvent(skillEvent);
    }

}
