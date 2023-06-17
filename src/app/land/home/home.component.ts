import { Component, OnInit } from '@angular/core';
import { LanddataService } from '../landdata.service';
import * as _ from 'lodash';
import { filter, reduce } from 'lodash';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/shared-module/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  columnsToDisplay = ['uniqueCode', 'landName', 'cityrural', 'divisions', 'villages', 'actions'];

  alldata: any[] = [];
  countdata: any[] = [];
  totalcountsingle!: number;
  message = '';
  filteredData: any[] = [];
  excelData: any[] = [];
  searchText: string = '';
  legalProceedingsFilter: string = '';
  statusFilter: string = '';
  currentPage = 1; // current page number
  itemsPerPage = 10; // number of items to be displayed per page
  totalItems = this.alldata.length; // total number of items
  totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // total number of pages
  userList: any[];
  transform(items: any[], options: any): any[] {
    const { itemsPerPage, currentPage } = options;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }


  constructor(private landdataService: LanddataService, private commonService: CommonService, private router: Router, public dialog: MatDialog, private snackbar: MatSnackBar,) { }

  ngOnInit(): void {
    const body = {
      types: null,
      values: null
    }
    this.commonService.apiPostCall(body, 'GetData').subscribe((data) => {
      this.userList = data;
      this.dataSource.data = data;
    })
    this.commonService.apiPostCall(body, 'GetDataCount').subscribe((data) => {
      this.countdata = data;
      this.totalcountsingle = reduce(this.countdata, (sum, obj) => sum + parseInt(obj.totalcount, 10), 0);
    })
  }

  delete(id: string): void {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        from: "delete",
      }
    });
    dialog.afterClosed().subscribe(data => {
      if (data) {

        // this.api.apiDeleteCall(id, 'Coupon/deleteCoupon').subscribe(response => {
        //   if (response.message.includes('Successfully')) {
        //     this.snackbar.openFromComponent(SnackbarComponent, {
        //       data: response.message,
        //     });
        //     this.getCouponsList();
        //   }
        // })
      }
    })
  }



  searchfilterData() {
    const searchText = this.searchText?.toLowerCase();
    console.log(this.searchText)
    this.filteredData = this.alldata.filter((data: any) => {
      return (
        (data.unique_code && data.unique_code.toLowerCase().includes(searchText)) ||
        (data.land_name && data.land_name.toLowerCase().includes(searchText)) ||
        (data.citynrural && data.citynrural.toLowerCase().includes(searchText)) ||
        (data.division && data.division.toLowerCase().includes(searchText)) ||
        (data.total_extent_land_acquired && data.total_extent_land_acquired.toLowerCase().includes(searchText)) ||
        (data.extent && data.extent.toLowerCase().includes(searchText)) ||
        (data.not_handed_over_extent && data.not_handed_over_extent.toLowerCase().includes(searchText)) ||
        (data.legalproceedings && data.legalproceedings.toLowerCase().includes(searchText))

      );
    });
  }




  get filterData() {
    if (this.legalProceedingsFilter || this.statusFilter) {
      return this.alldata.filter(data => {
        if (this.legalProceedingsFilter && data.legalproceedings !== this.legalProceedingsFilter) {
          return false;
        }
        if (this.statusFilter && data.status !== this.statusFilter) {
          return false;
        }
        return true;
      });
    } else {
      return this.alldata;
    }
  }



  edit(type, id) {
    console.log(id)
    this.router.navigate(['/land/' + type, id]);
  }


  exportExcel() {

    this.excelData = this.alldata.map(item => ({


      unique_code: item.unique_code,
      land_name: item.land_name,
      citynrural: item.citynrural,
      division: item.division,
      total_extent_land_acquired: item.total_extent_land_acquired,
      extent: item.extent,
      not_handed_over_extent: item.not_handed_over_extent,
      legalproceedings: item.legalproceedings


    }));

    const worksheet = XLSX.utils.json_to_sheet(this.excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, 'TableData.xlsx');
  }




}
