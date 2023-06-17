import { Component, OnInit } from '@angular/core';
import { LanddataService } from '../../land/landdata.service';
import * as XLSX from 'xlsx';
import {FilteredData } from '../../models/report2.interface';

@Component({
  selector: 'app-report2-lp',
  templateUrl: './report2-lp.component.html',
  styleUrls: ['./report2-lp.component.css']
})
export class Report2LPComponent implements OnInit {

  alldata : any[] = [];
  reportdata : any[] = [];
  divisionDataArray : any[] = [];
  filteredData: FilteredData = {};


  constructor(private landdataService: LanddataService) { }

  ngOnInit(): void {

    this.landdataService.getDataforDivcircity().subscribe(data => {
    this.alldata = data;
    // loop through each row of data
  for (let i = 0; i < this.alldata.length; i++) {
  // get the division and legalproceedings values from the current row
  let division = this.alldata[i].division;
  let legalproceedings = this.alldata[i].legalproceedings;
  // if the division is not already in the filteredData object, add it with an empty object
  if (!this.filteredData[division]) {
    this.filteredData[division] = {};
  }
  // if the legalproceedings is not already a property of the division in the filteredData object, add it with a count of 1
  if (!this.filteredData[division][legalproceedings]) {
    this.filteredData[division][legalproceedings] = 1;
  }
  // if the legalproceedings is already a property of the division in the filteredData object, increment its count by 1
  else {
    this.filteredData[division][legalproceedings]++;
  }
}
    this.divisionDataArray = Object.keys(this.filteredData).map((division) => {
     return { division, ...this.filteredData[division] };
     });
});
  }


  downloadExcel() {
    /* create worksheet */
    const ws = XLSX.utils.table_to_sheet(document.getElementById('tableId'));

    /* create workbook */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Land Proceedings Report.xlsx');
  }
}


