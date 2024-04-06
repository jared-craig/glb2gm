import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface AttributeWeightState {
  routeTechnique: number;
  routeElusiveness: number;
  receivingHands: number;
  catchInTraffic: number;
  receivingGrip: number;
  recAwareness: number;
  recConsistency: number;
  carryingGrip: number;
  powerRunning: number;
  elusiveRunning: number;
  carryingAwr: number;
  returnAwr: number;
  runBlkTech: number;
  runBlkPower: number;
  runBlkAwr: number;
  blockConsistency: number;
  balance: number;
  footwork: number;
  quickness: number;
  sprinting: number;
  vertical: number;
  diving: number;
  conditioning: number;
  toughness: number;
  snapReaction: number;
  heart: number;
  initimidation: number;
}

const initialState: AttributeWeightState = {
  routeTechnique: 1.1,
  routeElusiveness: 1.01,
  receivingHands: 1.1,
  catchInTraffic: 1.05,
  receivingGrip: 1.02,
  recAwareness: 1.01,
  recConsistency: 1.05,
  carryingGrip: 0.1,
  powerRunning: 0.0,
  elusiveRunning: 0.0,
  carryingAwr: 0.0,
  returnAwr: 0.0,
  runBlkTech: 0.0,
  runBlkPower: 0.0,
  runBlkAwr: 0.0,
  blockConsistency: 0.0,
  balance: 1.0,
  footwork: 1.0,
  quickness: 1.5,
  sprinting: 1.5,
  vertical: 0.1,
  diving: 0.1,
  conditioning: 1.0,
  toughness: 0.1,
  snapReaction: 1.0,
  heart: 0.1,
  initimidation: 0.0,
};

export const attributeWeightSlice = createSlice({
  name: 'attributeWeight',
  initialState,
  reducers: {
    updateAttributeWeight: (state, action: PayloadAction<{ attribute: string; value: number }>) => {
      console.log('state', state);
      console.log('action', action);
    },
  },
});

export const { updateAttributeWeight } = attributeWeightSlice.actions;

export default attributeWeightSlice.reducer;
