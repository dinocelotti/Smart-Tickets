import React, { Component } from 'react';
import {
  Form,
  Dropdown,
  Button,
  Header,
  Label,
  Segment,
  Icon,
  Menu,
  Input
} from 'semantic-ui-react';
import projectApi from '../../api/project-api';
import camelToHuman from '../../util/stringUtils';

export default class EndUser extends Component {
  state = { activeItem: 'info', loading: false };

  handleChange = itemToSet => (event, { value }) =>
    new Promise(resolve =>
      this.setState(prevState => {
        console.log('Previous state:', prevState, '\nForm value set:', {
          [itemToSet]: value
        });
        return { [itemToSet]: value };
      }, resolve)
    );

  handleSubmit = async () => {
    const { userAddress, name, information } = this.state;
    this.setState(() => ({ loading: true }));
    const userInstance = new projectApi.User({
      userAddress: userAddress
    });
    await userInstance.setUser(name, information);
    this.setState(() => ({ loading: false }));
  };

  makeDefaultInputs = inputNames => {
    return inputNames.reduce((inputsObj, inputKey) => {
      const humanField = camelToHuman(inputKey);
      const inputToAdd = {
        label: humanField,
        placeholder: humanField,
        id: inputKey,
        type: 'text',
        onChange: this.handleChange(inputKey)
      };
      return { ...inputsObj, [inputKey]: inputToAdd };
    }, {});
  };

  createDropdownItems() {
    return this.props.accounts.ids.map(id => ({
      value: id,
      text: id,
      description: `Balance in wei: ${this.props.accounts.byId[id].balance}`
    }));
  }

  handleClick = currentTab => {
    this.setState(() => ({ activeItem: currentTab }));
  };

  generateInputFormFields = metadata => {
    const inputsObj = this.generateInputs(metadata);
    return Object.keys(inputsObj).map(currentInputKey => (
      <Form.Field key={currentInputKey}>
        <Input {...inputsObj[currentInputKey]} />
      </Form.Field>
    ));
  };

  generateInputs = inputsObj => {
    const inputNames = Object.keys(inputsObj);
    return inputNames.reduce((defaultInputs, currentInputKey) => {
      const currentInput = inputsObj[currentInputKey];

      const customAttributeKeys = Object.keys(currentInput); //go down a sublevel and get the keys

      const currentCustomAttributes = customAttributeKeys.reduce(
        (customInputObject, currentAttribute) => ({
          ...customInputObject,
          [currentAttribute]: currentInput[currentAttribute]
        }),
        {}
      );

      const currentDefaultAttributes = defaultInputs[currentInputKey];

      const currentInputToAdd = {
        ...currentDefaultAttributes,
        ...currentCustomAttributes
      };

      return {
        ...defaultInputs,
        [currentInputKey]: currentInputToAdd
      };
    }, this.makeDefaultInputs(inputNames));
  };

  //TODO modify to use redux states
  getInfo = info => {
    return { name: 'Name: Bob', profession: 'About: Record label manager' };
  };

  generateInfoFields = metadata => {
    const inputsObj = this.getInfo(metadata);
    return Object.keys(inputsObj).map(currentInputKey => (
      <Segment>{inputsObj ? inputsObj[currentInputKey] : ''}</Segment>
    ));
  };

  render() {
    const { activeItem } = this.state;
    const accountAddressFormField = (
      <Form.Field required key="userAccount">
        <Label>Select which account address you'd like to use</Label>
        <Dropdown
          placeholder="Select account address"
          fluid
          search
          selection
          options={this.createDropdownItems()}
          onChange={this.handleChange('userAddress')}
        />
      </Form.Field>
    );

    const informationSegment = (
      <Segment.Group required key="infoSegment">
        {[
          ...this.generateInfoFields({
            personalInfo: {},
            personalBalance: {},
            ticketsOwned: {}
          })
        ]}
      </Segment.Group>
    );

    if (this.state.activeItem === 'edit') {
      return (
        <Segment>
          <Menu>
            <Menu.Item
              content="Review Info"
              active={activeItem === 'info'}
              onClick={() => this.handleClick('info')}
            />
            <Menu.Item
              content="Edit Info"
              active={activeItem === 'edit'}
              onClick={() => this.handleClick('edit')}
            />
          </Menu>
          <Segment>
            <Header as="h1"> User Information </Header>
            <Segment
              loading={!this.props.accounts || this.state.loading}
              onSubmit={this.handleSubmit}
            >
              {[
                accountAddressFormField,
                ...this.generateInputFormFields({
                  name: {},
                  information: {}
                })
              ]}
              <Button type="submit" onClick={this.handleSubmit}>
                {' '}
                Submit{' '}
              </Button>
            </Segment>
          </Segment>
        </Segment>
      );
    } else {
      return (
        <Segment required key="menuSegment">
          <Menu>
            <Menu.Item
              content="Review Info"
              active={activeItem === 'info'}
              onClick={() => this.handleClick('info')}
            />
            <Menu.Item
              content="Edit Info"
              active={activeItem === 'edit'}
              onClick={() => this.handleClick('edit')}
            />
          </Menu>
          <Segment>
            <Header as="h1"> Edit Users </Header>
            <Form
              loading={!this.props.accounts || this.state.loading}
              onSubmit={this.handleSubmit}
            >
              {[accountAddressFormField, informationSegment]}
            </Form>
          </Segment>
        </Segment>
      );
    }
  }
}
