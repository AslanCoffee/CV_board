export class CreateHistoryDto {
    id?: number;
    groupId: number;
    fieldName: string;
    oldValue?: string;
    newValue?: string;
    userId: number;
}
