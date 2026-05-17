import { Transformer, Helpers } from 'nubond';

@Transformer()
export class DateFormat {
    transform(data: { date: Date, format: 'ISOString' | 'DateString' }): string {
        return Helpers.isObject(data)
                    ? (data.format == 'ISOString'
                            ? data.date.toISOString()
                            : (data.format == 'DateString'
                                ? data.date.toDateString()
                                : data.date.toString()))
                    : '';
    }
}