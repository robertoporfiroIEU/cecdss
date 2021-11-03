import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import {
  AllYearsResults,
  FrcsInputs,
  Treatments,
  YearlyResult
} from '../../models/Types';
import { Button } from 'reactstrap';
import { formatCurrency, formatNumber } from '../Shared/util';
import { myBase64Image } from '../Shared/myBase64Image';

interface Props {
  allYearResults: AllYearsResults;
  yearlyResults: YearlyResult[];
  sensitivityChart: React.MutableRefObject<any>;
  frcsInputs: FrcsInputs;
  teaInputs: any;
  teaModel: string;
}

export const ResultsExport = (props: Props) => {
  // don't show export until all years are done running
  if (
    !props.yearlyResults ||
    props.yearlyResults.length < props.teaInputs.Financing.EconomicLife
  ) {
    return <></>;
  }

  const treatmentIndex = Treatments.findIndex(
    x => x.id === props.frcsInputs.treatmentid
  );
  const treatmentName = Treatments[treatmentIndex].name;

  const capitalCost = formatCurrency(props.teaInputs.CapitalCost);

  const makeExcel = async () => {
    // https://github.com/exceljs/exceljs#interface
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ExcelJS sheet');

    // This part increases the width of a chosen column
    const nameCol = worksheet.getColumn('B');
    nameCol.width = 38;

    worksheet.addTable({
      name: 'TechPerf',
      ref: 'B2',
      headerRow: true,
      totalsRow: false,
      columns: [{ name: 'Technical Performance' }, { name: ' ' }],
      rows: [
        ['Project Prescription', treatmentName],
        ['Facility Type', props.teaModel],
        ['Capital Cost ($)', capitalCost],
        [
          'Net Electrical Capacity (kWe)',
          props.allYearResults.teaInputs.ElectricalFuelBaseYear
            .NetElectricalCapacity
        ],
        [
          'Net Station Efficiency (%)',
          formatNumber(
            props.teaInputs.ElectricalFuelBaseYear.NetStationEfficiency
          )
        ],
        [
          'Economic Life (y)',
          props.allYearResults.teaInputs.Financing.EconomicLife
        ],
        [
          'Facility Coordinates',
          `${props.allYearResults.facilityCoordinates.lat}, ${props.allYearResults.facilityCoordinates.lng}`
        ],
        [
          'Biomass Coordinates',
          `${props.allYearResults.biomassCoordinates.lat}, ${props.allYearResults.biomassCoordinates.lng}`
        ],
        [
          'Proximity to substation (km)',
          props.allYearResults.distanceToNearestSubstation
        ]
      ]
    });

    worksheet.addTable({
      name: 'supply',
      ref: 'B15',
      headerRow: true,
      totalsRow: false,
      columns: [
        { name: 'Resource Supply' },
        { name: 'Unit' },
        { name: 'Total' },
        ...props.yearlyResults.map(r => ({ name: 'Y' + r.year }))
      ],
      rows: [
        [
          'Feedstock',
          'BDMT',
          formatNumber(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.totalDryFeedstock,
              0
            )
          ),
          ...props.yearlyResults.map(year =>
            formatNumber(year.totalDryFeedstock)
          )
        ],
        [
          'Coproduct',
          'BDMT',
          formatNumber(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.totalDryCoproduct,
              0
            )
          ),
          ...props.yearlyResults.map(year =>
            formatNumber(year.totalDryCoproduct)
          )
        ]
      ]
    });

    worksheet.addTable({
      name: 'analysis',
      ref: 'B19',
      headerRow: true,
      totalsRow: false,
      columns: [
        {
          name:
            'Fuel Consumption & Feedstock Transport (1 MWh electricity generated)'
        },
        { name: 'Unit' },
        { name: 'Total' },
        ...props.yearlyResults.map(r => ({ name: 'Y' + r.year }))
      ],
      rows: [
        [
          'Diesel',
          'L',
          formatNumber(
            (props.yearlyResults.reduce(
              (sum, year) => sum + year.lcaResults.inputs.diesel,
              0
            ) /
              props.yearlyResults.length) *
              1000
          ),
          ...props.yearlyResults.map(year =>
            formatNumber(year.lcaResults.inputs.diesel * 1000)
          )
        ],
        [
          'Gasoline',
          'L',
          formatNumber(
            (props.yearlyResults.reduce(
              (sum, year) => sum + year.lcaResults.inputs.gasoline,
              0
            ) /
              props.yearlyResults.length) *
              1000
          ),
          ...props.yearlyResults.map(year =>
            formatNumber(year.lcaResults.inputs.gasoline * 1000)
          )
        ],
        [
          'Jet Fuel',
          'L',
          formatNumber(
            (props.yearlyResults.reduce(
              (sum, year) => sum + year.lcaResults.inputs.jetfuel,
              0
            ) /
              props.yearlyResults.length) *
              1000
          ),
          ...props.yearlyResults.map(year =>
            formatNumber(year.lcaResults.inputs.jetfuel * 1000)
          )
        ],
        [
          'Transport Distance',
          'km',
          formatNumber(
            (props.yearlyResults.reduce(
              (sum, year) => sum + year.lcaResults.inputs.distance,
              0
            ) /
              props.yearlyResults.length) *
              1000
          ),
          ...props.yearlyResults.map(year =>
            formatNumber(year.lcaResults.inputs.distance * 1000)
          )
        ]
      ]
    });

    worksheet.addTable({
      name: 'lci',
      ref: 'B25',
      headerRow: true,
      totalsRow: false,
      columns: [
        { name: 'LCI Results (1 MWh electricity generated)' },
        { name: 'Unit' },
        { name: 'Total' },
        ...props.yearlyResults.map(r => ({ name: 'Y' + r.year }))
      ],
      rows: [
        [
          'CO2',
          'kg',
          formatNumber(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.lcaResults.lciResults.CO2 * 1000,
              0
            ) / props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatNumber(r.lcaResults.lciResults.CO2 * 1000)
          )
        ],
        [
          'CH4',
          'kg',
          formatNumber(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.lcaResults.lciResults.CH4,
              0
            ) / props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatNumber(r.lcaResults.lciResults.CH4)
          )
        ],
        [
          'N2O',
          'kg',
          formatNumber(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.lcaResults.lciResults.N2O,
              0
            ) / props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatNumber(r.lcaResults.lciResults.N2O)
          )
        ],
        [
          'CO',
          'kg',
          formatNumber(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.lcaResults.lciResults.CO,
              0
            ) / props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatNumber(r.lcaResults.lciResults.CO)
          )
        ],
        [
          'NOx',
          'kg',
          formatNumber(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.lcaResults.lciResults.NOx,
              0
            ) / props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatNumber(r.lcaResults.lciResults.NOx)
          )
        ],
        [
          'PM10',
          'kg',
          formatNumber(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.lcaResults.lciResults.PM10,
              0
            ) / props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatNumber(r.lcaResults.lciResults.PM10)
          )
        ],
        [
          'PM2.5',
          'kg',
          formatNumber(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.lcaResults.lciResults.PM25,
              0
            ) / props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatNumber(r.lcaResults.lciResults.PM25)
          )
        ],
        [
          'SOx',
          'kg',
          formatNumber(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.lcaResults.lciResults.SOx,
              0
            ) / props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatNumber(r.lcaResults.lciResults.SOx)
          )
        ],
        [
          'Carbon Intensity',
          'kg CO2e',
          formatNumber(
            (props.yearlyResults.reduce(
              (sum, year) => sum + year.lcaResults.lciResults.CI,
              0
            ) *
              1000) /
              props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatNumber(r.lcaResults.lciResults.CI * 1000)
          )
        ]
      ]
    });

    worksheet.addTable({
      name: 'lcia',
      ref: 'B36',
      headerRow: true,
      totalsRow: false,
      columns: [
        { name: 'LCIA Results (1 MWh electricity generated)' },
        { name: 'Unit' },
        { name: 'Total' },
        ...props.yearlyResults.map(r => ({ name: 'Y' + r.year }))
      ],
      rows: [
        [
          'Global Warming Air',
          'kg CO2 eq',
          formatNumber(
            (props.yearlyResults.reduce(
              (sum, year) =>
                sum + year.lcaResults.lciaResults.global_warming_air,
              0
            ) *
              1000) /
              props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatNumber(r.lcaResults.lciaResults.global_warming_air * 1000)
          )
        ],
        [
          'Acidification Air',
          'kg SO2 eq',
          formatNumber(
            (props.yearlyResults.reduce(
              (sum, year) =>
                sum + year.lcaResults.lciaResults.acidification_air,
              0
            ) *
              1000) /
              props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatNumber(r.lcaResults.lciaResults.acidification_air * 1000)
          )
        ],
        [
          'HH Particulate Air',
          'kg PM2.5 eq',
          formatNumber(
            (props.yearlyResults.reduce(
              (sum, year) =>
                sum + year.lcaResults.lciaResults.hh_particulate_air,
              0
            ) *
              1000) /
              props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatNumber(r.lcaResults.lciaResults.hh_particulate_air * 1000)
          )
        ],
        [
          'Euthrophication Air',
          'kg N eq',
          formatNumber(
            (props.yearlyResults.reduce(
              (sum, year) =>
                sum + year.lcaResults.lciaResults.eutrophication_air,
              0
            ) *
              1000) /
              props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatNumber(r.lcaResults.lciaResults.eutrophication_air * 1000)
          )
        ],
        [
          'Euthrophication Water',
          'kg N eq',
          formatNumber(
            (props.yearlyResults.reduce(
              (sum, year) =>
                sum + year.lcaResults.lciaResults.eutrophication_water,
              0
            ) *
              1000) /
              props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatNumber(r.lcaResults.lciaResults.eutrophication_water * 1000)
          )
        ],
        [
          'Smog Air',
          'kg O3 eq',
          formatNumber(
            (props.yearlyResults.reduce(
              (sum, year) => sum + year.lcaResults.lciaResults.smog_air,
              0
            ) *
              1000) /
              props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatNumber(r.lcaResults.lciaResults.smog_air * 1000)
          )
        ]
      ]
    });

    worksheet.addTable({
      name: 'technoeconomic',
      ref: 'B44',
      headerRow: true,
      totalsRow: false,
      columns: [
        { name: 'Technoeconomic Analysis' },
        { name: 'Unit' },
        { name: 'Total' },
        ...props.yearlyResults.map(r => ({ name: 'Y' + r.year }))
      ],
      rows: [
        [
          'Harvest Cost',
          '$/BDMT',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.harvestCostPerDryTon,
              0
            ) / props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.harvestCostPerDryTon)
          )
        ],
        [
          'Transport Cost',
          '$/BDMT',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.transportationCostPerDryTon,
              0
            ) / props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.transportationCostPerDryTon)
          )
        ],
        [
          'Move-in Cost',
          '$/BDMT',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.moveInCostPerDryTon,
              0
            ) / props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.totalMoveInCost / r.moveInCostPerDryTon)
          )
        ],
        [
          'Feedstock Cost',
          '$/BDMT',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.totalCostPerDryTon,
              0
            ) / props.yearlyResults.length
          ),
          ...props.yearlyResults.map(r => formatCurrency(r.totalCostPerDryTon))
        ],
        [
          'Equity Recovery',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.EquityRecovery,
              0
            )
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.cashFlow.EquityRecovery)
          )
        ],
        [
          'Equity Interest',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.EquityInterest,
              0
            )
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.cashFlow.EquityInterest)
          )
        ],
        [
          'Equity Principal Paid',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.EquityPrincipalPaid,
              0
            )
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.cashFlow.EquityPrincipalPaid)
          )
        ],
        [
          'Equity Principal Remaining',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.EquityPrincipalRemaining,
              0
            )
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.cashFlow.EquityPrincipalRemaining)
          )
        ],
        [
          'Debt Recovery',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.DebtRecovery,
              0
            )
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.cashFlow.DebtRecovery)
          )
        ],
        [
          'Debt Interest',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.DebtInterest,
              0
            )
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.cashFlow.DebtInterest)
          )
        ],
        [
          'Debt Principal Paid',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.DebtPrincipalPaid,
              0
            )
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.cashFlow.DebtPrincipalPaid)
          )
        ],
        [
          'Debt Principal Remaining',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.DebtPrincipalRemaining,
              0
            )
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.cashFlow.DebtPrincipalRemaining)
          )
        ],
        [
          'Feedstock Cost',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.BiomassFuelCost,
              0
            )
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.cashFlow.BiomassFuelCost)
          )
        ],
        [
          'Non-fuel Expenses',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.NonFuelExpenses,
              0
            )
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.cashFlow.NonFuelExpenses)
          )
        ],
        [
          'Debt Reserve',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.DebtReserve,
              0
            )
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.cashFlow.DebtReserve)
          )
        ],
        [
          'Deprecation',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.Depreciation,
              0
            )
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.cashFlow.Depreciation)
          )
        ],
        [
          'Income--Capacity',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.IncomeCapacity,
              0
            )
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.cashFlow.IncomeCapacity)
          )
        ],
        [
          'Interest on Debt Reserve',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.InterestOnDebtReserve,
              0
            )
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.cashFlow.InterestOnDebtReserve)
          )
        ],
        [
          'Taxes w/o credit',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.TaxesWoCredit,
              0
            )
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.cashFlow.TaxesWoCredit)
          )
        ],
        [
          'Tax Credit',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.TaxCredit,
              0
            )
          ),
          ...props.yearlyResults.map(r => formatCurrency(r.cashFlow.TaxCredit))
        ],
        [
          'Taxes',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.Taxes,
              0
            )
          ),
          ...props.yearlyResults.map(r => formatCurrency(r.cashFlow.Taxes))
        ],
        [
          'Energy Revenue Required',
          '$',
          formatCurrency(
            props.yearlyResults.reduce(
              (sum, year) => sum + year.cashFlow.EnergyRevenueRequired,
              0
            )
          ),
          ...props.yearlyResults.map(r =>
            formatCurrency(r.cashFlow.EnergyRevenueRequired)
          )
        ],
        [
          'Current LCOE',
          '$/MWh',
          formatCurrency(
            (props.yearlyResults.reduce(
              (sum, year) => sum + year.currentLCOE,
              0
            ) /
              props.yearlyResults.length) *
              1000
          ),
          ...props.yearlyResults.map(r => formatCurrency(r.currentLCOE * 1000))
        ],
        [
          'Constant LCOE',
          '$/MWh',
          formatCurrency(
            (props.yearlyResults.reduce(
              (sum, year) => sum + year.constantLCOE,
              0
            ) /
              props.yearlyResults.length) *
              1000
          ),
          ...props.yearlyResults.map(r => formatCurrency(r.constantLCOE * 1000))
        ]
      ]
    });

    worksheet.addTable({
      name: 'assumptions',
      ref: 'B102',
      headerRow: true,
      totalsRow: false,
      columns: [{ name: 'Assumptions' }, { name: 'Total' }],
      rows: [
        ['LogLength, ft', 32],
        ['LoadWeight, green tons (logs)', 25],
        ['LoadWeight, green tons (chips)', 25],
        ['CTLTrailSpacing, ft', 50],
        ['HardwoodCostPremium, fraction', 0.2],
        ['ResidueRecoveryFraction for WT systems', 0.8],
        ['ResidueRecoveryFraction for CTL', 0.5],
        ['HardwoodFractionCT', 0.2],
        ['HardwoodFractionSLT', 0],
        ['HardwoodFractionLLT', 0],
        ['Feller/Bucker wage (2019)', 30.96],
        ['All Others wage (2019)', 22.26],
        ['Benefits and other payroll costs', '35%'],
        ['OIL_ETC_COST ($/mile)', 0.35],
        ['DRIVERS_PER_TRUCK', 1.67],
        ['MILES_PER_GALLON', 6],
        ['FUEL_COST ($/gallon)', 3.251],
        ['TRUCK_LABOR ($/hr)', 23.29]
      ]
    });

    worksheet.addTable({
      name: 'keyReferences',
      ref: 'B122',
      headerRow: true,
      totalsRow: false,
      columns: [{ name: 'Key References' }],
      rows: [
        ['Fuel Reduction Cost Simulator'],
        ['Advanced Hardwood Biofuels Northwest'],
        ['California Biomass Collaborative'],
        ['EPA eGrid'],
        ['GREET model'],
        ['Literature for emission factors']
      ]
    });

    worksheet.addTable({
      name: 'disclaimer',
      ref: 'B130',
      headerRow: true,
      totalsRow: false,
      columns: [{ name: 'Disclaimer' }],
      rows: [
        [
          'Results are estimates only and no guarantees are made that actual project performance will match, and they do not necessarily reflect the views and policies of the California Energy Commission.'
        ]
      ]
    });

    const workbookBuffer = await workbook.xlsx.writeBuffer();

    // send file to client
    saveAs(
      new Blob([workbookBuffer], { type: 'application/octet-stream' }),
      `cecdata.xlsx`
    );
  };

  return (
    <p>
      <Button color='primary' onClick={makeExcel}>
        Export results to Excel
      </Button>
    </p>
  );
};

export default ResultsExport;
