// -- copyright
// OpenProject is an open source project management software.
// Copyright (C) 2012-2020 the OpenProject GmbH
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See docs/COPYRIGHT.rdoc for more details.
// ++

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Injector,
  ViewEncapsulation
} from "@angular/core";
import {OpModalComponent} from "core-components/op-modals/op-modal.component";
import {InjectField} from "core-app/helpers/angular/inject-field.decorator";
import {I18nService} from "core-app/modules/common/i18n/i18n.service";
import {OpModalLocalsMap} from "core-components/op-modals/op-modal.types";
import {OpModalLocalsToken} from "core-components/op-modals/op-modal.service";
import {TimezoneService} from "core-components/datetime/timezone.service";
import flatpickr from "flatpickr";

@Component({
  templateUrl: './datepicker.modal.html',
  styleUrls: ['./datepicker.modal.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DatePickerModal extends OpModalComponent implements AfterViewInit {
  @InjectField() I18n:I18nService;
  @InjectField() timezoneService:TimezoneService;

  text = {
    save: this.I18n.t('js.button_save'),
    cancel: this.I18n.t('js.button_cancel'),
    clear: this.I18n.t('js.work_packages.button_clear'),
    manualScheduling: this.I18n.t('js.scheduling.manual'),
    automaticScheduling: this.I18n.t('js.scheduling.automatic'),
    startDate: this.I18n.t('js.work_packages.properties.startDate'),
    endDate: this.I18n.t('js.work_packages.properties.dueDate'),
  };

  private _startDate:string;
  private _endDate:string;

  constructor(readonly injector:Injector,
              @Inject(OpModalLocalsToken) public locals:OpModalLocalsMap,
              readonly cdRef:ChangeDetectorRef,
              readonly elementRef:ElementRef) {
    super(locals, cdRef, elementRef);
    this.startDate = locals.dates.startDate;
    this.endDate = locals.dates.endDate;
  }

  ngAfterViewInit():void {
    this.refreshDatepicker();
  }

  changeSchedulingMode() {
    // Todo
  }

  save():void {
    // Todo
  }

  cancel():void {
    // Todo
  }

  clear():void {
    // Todo
  }

  updateFlatpickrDates(val:string) {
    if (this.validDate(val)) {
      this._startDate = val;
    } else {
      const splittedDate = val.split(' ');
      this._startDate = splittedDate[0];
      this._endDate = splittedDate[2];
    }
  }

  get startDate():string {
    if (this._startDate) {
      if (this.validDate(this._startDate)) {
        var date = this.timezoneService.parseDate(this._startDate);
        return this.timezoneService.formattedISODate(date);
      } else {
        return this._startDate;
      }
    } else {
      return '-'
    }
  }

  set startDate(val:string) {
    this._startDate = val;
    if (this.validDate(this._startDate)) {
      this.refreshDatepicker();
    }
  }

  get endDate():string {
    if (this._endDate) {
      if (this.validDate(this._endDate)) {
        var date = this.timezoneService.parseDate(this._endDate);
        return this.timezoneService.formattedISODate(date);
      } else {
        return this._endDate;
      }
    } else {
      return '-'
    }
  }

  set endDate(val:string) {
    this._endDate = val;
    if (this.validDate(this._endDate)) {
      this.refreshDatepicker();
    }
  }

  schedulingButtonText():string {
    return this.locals.scheduleManually ? this.text.automaticScheduling : this.text.manualScheduling ;
  }

  schedulingButtonIcon():string {
    return 'button--icon ' + (this.locals.scheduleManually ?  'icon-arrow-left-right' : 'icon-pin');
  }

  reposition(element:JQuery<HTMLElement>, target:JQuery<HTMLElement>) {
    element.position({
      my: 'left top',
      at: 'left bottom',
      of: target,
      collision: 'flipfit'
    });
  }

  private refreshDatepicker() {
    flatpickr('#flatpickr-input', {
      mode: 'range',
      inline: true,
      defaultDate: [this.startDate, this.endDate]
    });
  }

  private validDate(date:string) {
    // Todo: improve
    return !!new Date(date).valueOf();
  }
}