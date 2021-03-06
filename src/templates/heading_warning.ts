import { DatabaseType } from '../helper/database_type';

export default function getHeadingWarning(version: string, databaseType: DatabaseType): string {
  const extensionName: string = 'vscode-f-orm-m8';
  const ormM8: string = 'f-orm-m8';
  const currentTimestamp: number = Date.now();

  return `
// GENERATED CODE - DO NOT MODIFY THIS HEADER
// **************************************************************************
// Generator: ${extensionName} 
// Version: ${version}
// Database: ${databaseType}
// Timestamp: ${currentTimestamp}
// **************************************************************************
// 
// WARNING: If you alter the lines above, on future updates
//          the extension will skip this file
// 
// USER CODE - FROM THIS LINE YOU ARE FREE TO MODIFY THE CONTENT
//
// The model respect ${ormM8} framework annotations system
// More info on: https://github.com/matei-tm/f-orm-m8
//
// You are free and also responsible to add your own fields
//   and annotate according to ${ormM8}
//
// If you changed this file you must 
//   re-run the extension 
//   f-orm-m8: Generate ${databaseType} Fixture
//   from the command pallette

`;
}
