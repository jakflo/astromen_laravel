import React, { Component } from 'react';

export default class SkillFieldForForm extends React.Component
{
    constructor(props) {
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
        var toto = this;
        document.addEventListener('astromanFormRemoveSkill', function(event) {
            toto.removeNewAddedSkill(event.detail.id);
        });
        document.addEventListener('removeAstromanExtraSkills', function(event) {
            toto.setState({extraItems: []});
        });
    }
    
    loadItems()
    {
        var items = [];
        var k;
        for (k in this.props.data) {
            let skillItem = this.props.data[k];
            items.push(<SkillCheckbox key={skillItem.id} skillItem={skillItem} />);
        }
        
        return items.concat(this.state.extraItems);
    }
    
    isPropsChanged()
    {
        if (this.props.data.length !== this.state.items.length) {
            return true;
        }
        
        var k;
        for (k in this.props.data) {
            let propItem = this.props.data[k];
            let oldPropItem = this.oldProps.data[k];
            if (propItem.id !== oldPropItem.id || propItem.name !== oldPropItem.name) {
                return true;
            }
        }
        
        return false;
    }
    
    createAndAddNewSkill()
    {
        var extraItems = this.state.extraItems;
        var keyName = "nsf" + this.newItemCounter;
        extraItems.push(<SkillInput idKey={this.newItemCounter} key={keyName} keyName={keyName} />);
        this.setState({extraItems: extraItems});
        this.newItemCounter++;
    }
    
    selectNewSkill()
    {
        var extraItems = this.state.extraItems;
        var keyName = "ssf" + this.newItemCounter;
        extraItems.push(<SkillSelect idKey={this.newItemCounter} aviableSkills={this.props.aviableSkills} key={keyName} keyName={keyName} />);
        this.setState({extraItems: extraItems});
        this.newItemCounter++;
    }
    
    removeNewAddedSkill(keyName)
    {
        var extraItems = this.state.extraItems;
//		console.log(extraItems);
//		console.log(extraItems[0].key);
        
        var k;
        var keyFound = false;
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

class SkillCheckbox extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.skillItem
        };
    }
    
    render()
    {
        var skillLabelId = 'skill_item_' + this.state.data.id;
        var formName = "skill[" + this.state.data.id + "]";
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

class SkillInput extends React.Component
{
    constructor(props) {
        super(props);
    }
    
    render()
    {
        var idName = "new_id" + this.props.idKey;
        var formName = "skill[" + idName + "]";
        
        return (
            <>
                <li>
                    <input type="text" name={formName} />
                    <button type="button" data-id={this.props.idKey} onClick={() => {this.removeMyself(this);}}>Zrušit</button>
                </li>
            </>
        );
    }
    
    removeMyself(toto)
    {
        var skillEvent = new CustomEvent('astromanFormRemoveSkill', {detail:{id: toto.props.keyName}});
        document.dispatchEvent(skillEvent);
    }
    
}

class SkillSelect extends React.Component
{
    constructor(props) {
        super(props);
    }
    
    render()
    {
        var idName = "selected_id" + this.props.idKey;
        var formName = "skill[" + idName + "]";
        
        var selectOptions = [<option key="sso0" value="0">---Vybetre dovednost---</option>];
        this.props.aviableSkills.forEach((skillItem) => {
            let keyName = "sso" + skillItem.id;
            selectOptions.push(<option key={keyName} value={skillItem.id}>{skillItem.name}</option>);
        });
        
        return (
            <>
                <li>
                    <select name={formName}>{selectOptions}</select>
                    <button type="button" data-id={this.props.idKey} onClick={() => {this.removeMyself(this);}}>Zrušit</button>
                </li>
            </>
        );
    }
    
    removeMyself(toto)
    {
        var skillEvent = new CustomEvent('astromanFormRemoveSkill', {detail:{id: toto.props.keyName}});
        document.dispatchEvent(skillEvent);
    }
    
}
