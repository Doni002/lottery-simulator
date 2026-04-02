import { WEEKS_PER_YEAR } from '../../common/constants/time.constants';

export const MIN_LOTTO_NUM = 1;
export const MAX_LOTTO_NUM = 90;
export const REQUIRED_NUMBERS = 5;
export const LOTTERY_PRIZE = 300;
export const MIN_PERSISTED_MATCH_COUNT = 2;

export const MIN_DRAW_SPEED_MS = 10;
export const MAX_DRAW_SPEED_MS = 1000;
export const DEFAULT_DRAW_SPEED_MS = 750;
export const MAX_SIMULATION_YEARS = 500;
export const MAX_SIMULATION_DRAWS = MAX_SIMULATION_YEARS * WEEKS_PER_YEAR;
