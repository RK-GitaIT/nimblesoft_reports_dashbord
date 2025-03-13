import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserColorService {
  getUserColor(user: { firstName: string; lastName: string }): string {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    console.log(user);
    const fullName = user.firstName + user.lastName;
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }
}
