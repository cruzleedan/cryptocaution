import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ratingLabel'
})
export class RatingLabelPipe implements PipeTransform {

    transform(rating: any, args?: any): any {
        if (!rating || rating === 0) {
            return '0';
        }
        rating = parseFloat(rating);
        const indx = Math.round(rating) - 1;
        const labels = ['Bad', 'Poor', 'Average', 'Great', 'Excellent'];
        return indx >= 0 ? labels[indx] : '';
    }

}
