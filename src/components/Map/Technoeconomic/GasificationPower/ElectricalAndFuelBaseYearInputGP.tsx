import React from 'react';
import { ElectricalFuelBaseYearInputModGP } from '@ucdavis/tea/out/models/input.model';
import {
  FormText,
  FormGroup,
  Label,
  InputGroup,
  Input,
  InputGroupAddon
} from 'reactstrap';

interface Props {
  inputs: ElectricalFuelBaseYearInputModGP;
  setInputs: (inputs: any) => void;
}

export const ElectricalAndFuelBaseYearInputGP = (props: Props) => {
  if (!props.inputs) {
    return null;
  }
  return (
    <>
      <FormGroup>
        <Label>Gross Electrical Capacity</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.GrossElectricalCapacity}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                GrossElectricalCapacity: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>kWe</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>Total gross generating capacity</FormText>
      </FormGroup>
      <FormGroup>
        <Label>Net Electrical Capacity</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.NetElectricalCapacity}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                NetElectricalCapacity: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>kWe</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>
          Net power available for on-site use or grid sales
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label>Capacity Factor</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.CapacityFactor}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                CapacityFactor: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>kWe</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>
          Annual fraction that rated capacity is available from plant
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label>Moisture Content</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.MoistureContent}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                MoistureContent: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>% wet basis</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>
          Moisture Content of Biomass Feedstock to Gasifier
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label>HHV Efficiency</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.HHVEfficiency}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                HHVEfficiency: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>%</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>
          HHV Efficiency of Gasification System--Biomass to Clean Gas
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label>Net HHV Efficiency</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.NetHHVEfficiency}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                NetHHVEfficiency: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>%</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>
          Net HHV Efficiency of Power Generation incl. Dual Fuel
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label>Fraction Of Input Energy</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.FractionOfInputEnergy}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                FractionOfInputEnergy: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>%</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>Dual Fuel -> Fraction of Input Energy</FormText>
      </FormGroup>
      <FormGroup>
        <Label>CO</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.CO}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                CO: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>% by volume, dry</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>Clean Gas Composition -> CO</FormText>
      </FormGroup>
      <FormGroup>
        <Label>H2</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.H2}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                H2: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>% by volume, dry</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>Clean Gas Composition -> H2</FormText>
      </FormGroup>
      <FormGroup>
        <Label>Hydrocarbons</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.Hydrocarbons}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                Hydrocarbons: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>% by volume, dry</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>
          Clean Gas Composition -> Hydrocarbons (as CH4)
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label>CO2</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.CO2}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                CO2: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>% by volume, dry</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>Clean Gas Composition -> CO2</FormText>
      </FormGroup>
      <FormGroup>
        <Label>O2</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.O2}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                O2: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>% by volume, dry</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>Clean Gas Composition -> O2</FormText>
      </FormGroup>
      <FormGroup>
        <Label>HHV</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.HHV}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                HHV: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>kJ/kg</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>
          Higher Heating Value of Biomass Feedstock to Gasifier
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label>Ash Content</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.AshContent}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                AshContent: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>% dry matter</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>Ash Content of Biomass</FormText>
      </FormGroup>
      <FormGroup>
        <Label>Carbon Concentration</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.CarbonConcentration}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                CarbonConcentration: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>% dry basis</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>Carbon Concentration of Char</FormText>
      </FormGroup>
    </>
  );
};
