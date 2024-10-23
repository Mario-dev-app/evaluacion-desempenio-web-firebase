import { Injectable } from '@angular/core';
import { MessageService, /* ConfirmationService */ } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private messageService: MessageService,
    /* private confirmationService: ConfirmationService */
  ) { }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  showInfo(message: string) {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
  }

  showWarning(message: string) {
    this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: message });
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  /* simpleConfirm(handleAccept: Function, handleReject: Function) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: handleAccept,
      reject: handleReject
  });
  } */
}
