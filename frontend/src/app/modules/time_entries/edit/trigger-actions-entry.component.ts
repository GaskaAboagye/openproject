import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, OnInit} from "@angular/core";
import {InjectField} from "core-app/helpers/angular/inject-field.decorator";
import {TimeEntryEditService} from "core-app/modules/time_entries/edit/edit.service";
import {TimeEntryCacheService} from "core-components/time-entries/time-entry-cache.service";
import {I18nService} from "core-app/modules/common/i18n/i18n.service";
import {TimeEntryResource} from "core-app/modules/hal/resources/time-entry-resource";
import {TimeEntryDmService} from "core-app/modules/hal/dm-services/time-entry-dm.service";
import {NotificationsService} from "core-app/modules/common/notifications/notifications.service";

export const triggerActionsEntryComponentSelector = 'time-entry--trigger-actions-entry';

@Component({
  selector: triggerActionsEntryComponentSelector,
  template: `
    <a *ngIf="entry"
       (click)="editTimeEntry(entry)"
       [title]="text.edit"
       class="no-decoration-on-hover">
      <op-icon icon-classes="icon-context icon-edit"></op-icon>
    </a>
    <a *ngIf="entry"
       (click)="deleteTimeEntry(entry)"
       [title]="text.delete"
       class="no-decoration-on-hover">
      <op-icon icon-classes="icon-context icon-delete"></op-icon>
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TriggerActionsEntryComponent implements OnInit {
  @InjectField() readonly timeEntryEditService:TimeEntryEditService;
  @InjectField() readonly timeEntryCache:TimeEntryCacheService;
  @InjectField() readonly timeEntryDmService:TimeEntryDmService;
  @InjectField() readonly notificationsService:NotificationsService;
  @InjectField() readonly elementRef:ElementRef;
  @InjectField() readonly i18n:I18nService;
  @InjectField() readonly cdRef:ChangeDetectorRef;

  public entry:TimeEntryResource;

  public text = {
    edit: this.i18n.t('js.button_edit'),
    delete: this.i18n.t('js.button_delete'),
    error: this.i18n.t('js.error.internal'),
    areYouSure: this.i18n.t('js.text_are_you_sure')
  };

  constructor(readonly injector:Injector) {

  }

  ngOnInit() {
    let timeEntryId = this.elementRef.nativeElement.dataset['entry'];
    this.timeEntryCache
      .require(timeEntryId)
      .then((loadedEntry) => {
        this.entry = loadedEntry;
        this.cdRef.detectChanges();
      });
  }

  editTimeEntry(entry:TimeEntryResource) {
    this.timeEntryEditService
      .edit(entry)
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        // User canceled the modal
      });
  }

  deleteTimeEntry(entry:TimeEntryResource) {
    if (!window.confirm(this.text.areYouSure)) {
      return;
    }

    this.timeEntryDmService
      .delete(entry)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        this.notificationsService.addError(error || this.text.error);
      });
  }
}