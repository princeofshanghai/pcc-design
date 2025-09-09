# Experimentation flows

| Term | Definition |
| :---- | :---- |
| Global Price Changes | Price Changes which take effect within a Price without needing a new Price.  |
| SKU | Unit of transaction |
| Price | Collection of Price points. SKU is mapped to a Price. |
| Price point | Actual Price values given currency, eligibility and validity dates. |
| GTM Motion | A change request comprising all entity changes requested by business. |
| Price Uplift | Changing the prices for existing paying customers. |
| Base SKUs | A set of SKUs which are sold as base variants by a LOB under a Product. These SKUs are sold indefinitely and do not have an end date. |
| Experimental Variant SKU | An experimental variant of a base SKU which is sold in parallel to the SKU and has a set of rules attached to it which drive how the SKU is sold to new vs existing customers. |

## Setup Base SKUs

Base SKUs: S1, … , S9

## Launching an Experiment

In order to launch a new experiment, the user will be expected to clone the existing SKUs and create new SKUs given the changing SKU attributes. 

| Base SKU | Experimental Variant SKU |
| :---- | :---- |
| S1 | S1’ |
| S2 | S2’ |
| … | … |
| S9 | S9’ |

Note that the system can allow multiple Experimental Variants to exist for a given Base SKU. The set of Base SKUs are SKUs which are sold at any point of time to multiple customers and don’t have an end date.

### Experimentation Paths

LOBs will have the option to sell the new variant SKUs to new customers only or to existing customers on renewals.

1. New Customers \- Only new members get the experimental variant.  
2. Existing Customers \- Existing customers get the experimental variant on renewal. 

## Concluding the Experiment

Once the experiment concludes, the users will be expected to either deactivate the SKU or replace the base SKU with the SKU. There are several flows which are possible.  

### Winning SKU Path

S1’ is selected as the winner. S1’ will replace S1 as the new base variant. Users will be given 2 options for S1, either mark it as deactivated or archived. 

1. New Contracts \- S1’ will be the base variant sold to customers.  
2. Existing Contracts for S1 \- There are 2 paths based on the users choice  
   1. Deactivated \- Existing Contracts will continue to renew with S1.  
   2. Archived \- Existing Contracts will switch to S1’ on renewals.

### Losing SKU Path

S1’ loses out. S1 continues to be the base variant. S1’ will be marked as deactivated or archived.

1. New Contracts \- S1 will be the base variant sold to customers.  
2. Existing Contracts for S1’ \- There are 2 paths based on the users choice  
   1. Deactivated \- Existing Contracts will continue to renew with S1’.  
   2. Archived \- Existing Contracts will switch to S1 on renewals.

Note that once a SKU is marked as deactivated or archived, they cannot be activated again.  
