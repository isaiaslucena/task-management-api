import { BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  private isStatusValid(status: any) {
    const index = this.allowedStatuses.indexOf(status);

    return index !== -1;
  }

  transform(value: string) {
    const upperCaseValue = value.toUpperCase();

    if (!this.isStatusValid(upperCaseValue)) throw new BadRequestException(`"${value}" is an invalid status!`);

    return value;
  }
}