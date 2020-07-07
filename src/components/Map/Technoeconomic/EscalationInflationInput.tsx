import React from 'react';
import {
  EscalationInflationInputModGP,
  EscalationInflationInputMod
} from '@ucdavis/tea/out/models/input.model';
import {
  FormText,
  FormGroup,
  Label,
  InputGroup,
  Input,
  InputGroupAddon
} from 'reactstrap';
import { EscalationInflationInputModGPClass } from '../../../models/GPClasses';

interface Props {
  inputs: EscalationInflationInputMod | EscalationInflationInputModGP;
  setInputs: (inputs: any) => void;
}

export const EscalationInflationInput = (props: Props) => {
  if (!props.inputs) {
    return null;
  }
  return (
    <>
      <FormGroup>
        <Label>General Inflation</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.GeneralInflation}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                GeneralInflation: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>%</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>
          Overall inflation rate used to adjust current dollar result to
          constant dollars
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label>Escalation Biomass Fuel</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.EscalationBiomassFuel}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                EscalationBiomassFuel: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>%/year</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>
          Rate at which biomass fuel cost escalates over time
        </FormText>
      </FormGroup>
      {props.inputs instanceof EscalationInflationInputModGPClass && (
        <FormGroup>
          <Label>Escalation Dual Fuel</Label>
          <InputGroup>
            <Input
              type='text'
              value={props.inputs.EscalationDualFuel}
              onChange={e =>
                props.setInputs({
                  ...props.inputs,
                  EscalationDualFuel: Number(e.target.value)
                })
              }
            />
            <InputGroupAddon addonType='append'>%/year</InputGroupAddon>
          </InputGroup>
          <FormText color='muted'>
            Rate at which dual fuel cost escalates over time
          </FormText>
        </FormGroup>
      )}
      <FormGroup>
        <Label>Escalation Production Tax Credit</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.EscalationProductionTaxCredit}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                EscalationProductionTaxCredit: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>%</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>
          Specified index for production tax credit
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label>Escalation Heat Sales</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.EscalationHeatSales}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                EscalationHeatSales: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>%/year</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>Escalation rate applied to heat sales</FormText>
      </FormGroup>
      {props.inputs instanceof EscalationInflationInputModGPClass && (
        <FormGroup>
          <Label>Escalation Char Sales</Label>
          <InputGroup>
            <Input
              type='text'
              value={props.inputs.EscalationCharSales}
              onChange={e =>
                props.setInputs({
                  ...props.inputs,
                  EscalationCharSales: Number(e.target.value)
                })
              }
            />
            <InputGroupAddon addonType='append'>%/year</InputGroupAddon>
          </InputGroup>
          <FormText color='muted'>
            Escalation rate applied to char or ash
          </FormText>
        </FormGroup>
      )}
      <FormGroup>
        <Label>Escalation Other</Label>
        <InputGroup>
          <Input
            type='text'
            value={props.inputs.EscalationOther}
            onChange={e =>
              props.setInputs({
                ...props.inputs,
                EscalationOther: Number(e.target.value)
              })
            }
          />
          <InputGroupAddon addonType='append'>%/year</InputGroupAddon>
        </InputGroup>
        <FormText color='muted'>
          Rate at which other expenses escalate over time
        </FormText>
      </FormGroup>
    </>
  );
};
