// Application-wide constants for cities and property types

export const CITIES = ['Bangalore', 'Hyderabad', 'Mumbai', 'Chennai'] as const;
export const PROPERTY_TYPES = ['Rent', 'Plot', 'Flat', 'Commercial', 'Farmland'] as const;

export type City = typeof CITIES[number];
export type PropertyType = typeof PROPERTY_TYPES[number];
