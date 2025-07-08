import { Component, OnInit } from '@angular/core';
import { BeService } from '../../services/be/be.service';
import { MatDialog } from '@angular/material/dialog';
import { NotApprovedCptComponent } from '../../dialog/not-approved-cpt/not-approved-cpt.component';

@Component({
  selector: 'app-autorisation',
  standalone: false,
  templateUrl: './autorisation.component.html',
  styleUrl: './autorisation.component.scss',
})
export class AutorisationComponent implements OnInit {
  constructor(private beService: BeService, private dialog: MatDialog) {}
  listUsers!: any;
  state: string = 'En Attente';
  state_be: string = 'En Attente';
  state_cf: string = 'En Attente';
  state_style: string = 'status-badge status-pending';
  state_style_be: string = 'status-badge status-pending';
  state_style_cf: string = 'status-badge status-pending';
  compte: boolean = false;
  be: boolean = false;
  cf: boolean = false;
  ngOnInit(): void {
    this.beService.getListUsers().subscribe((result: any) => {
      if (result) {
        console.log(result);
        this.listUsers = result.data;
        this.listUsers = this.listUsers.filter(
          (user: any) => user.state != 'admin'
        );
        this.listUsers = this.listUsers.map((user: any) => ({
          ...user,
          state: user.approved ? 'Approuvé' : 'En Attente',
          state_be: user.approved_be ? 'Approuvé' : 'En Attente',
          state_cf: user.approved_cf ? 'Approuvé' : 'En Attente',
          state_style: user.approved
            ? 'status-badge status-approved'
            : 'status-badge status-pending',
          state_style_be: user.approved_be
            ? 'status-badge status-approved'
            : 'status-badge status-pending',
          state_style_cf: user.approved_cf
            ? 'status-badge status-approved'
            : 'status-badge status-pending',
        }));
      }
    });

    //state gestion
  }

  approvedStateCpt(user: any) {
    user.state_style = 'status-badge status-approved';
    user.state = 'Approuvé';
    user.approved = 1;
  }

  rejectStateCpt(user: any) {
    user.state_style = 'status-badge status-pending';
    user.state = 'En Attente';
    user.approved = 0;
  }

  approvedStateBE(user: any) {
    user.state_style_be = 'status-badge status-approved';
    user.state_be = 'Approuvé';
    user.approved_be = 1;
  }

  rejectStateBE(user: any) {
    user.state_style_be = 'status-badge status-pending';
    user.state_be = 'En Attente';
    user.approved_be = 0;
  }

  approvedStateCF(user: any) {
    user.state_style_cf = 'status-badge status-approved';
    user.state_cf = 'Approuvé';
    user.approved_cf = 1;
  }

  rejectStateCF(user: any) {
    user.state_style_cf = 'status-badge status-pending';
    user.state_cf = 'En Attente';
    user.approved_cf = 0;
  }

  clear(user: any) {
    user.state_style = 'status-badge status-pending';
    user.state_style_be = 'status-badge status-pending';
    user.state_style_cf = 'status-badge status-pending';
    user.state = 'En Attente';
    user.state_be = 'En Attente';
    user.state_cf = 'En Attente';
  }

  saveState(user: any) {
    const data = {
      ...user,
    };
    console.log(data);
    this.beService.updateState(data).subscribe((result: any) => {
      if (result) {
        console.log(result);
        this.dialog.open(NotApprovedCptComponent, {
          data: {
            title: 'Notification',
            message: "Etat mis à jour sur l'utilisateur " + user.nom,
          },
        });
      }
    });
  }

  getPendingCount(){
    let cpt = 0
    this.listUsers.map((user:any)=>{
      if(user.approved == '0'){
        cpt++
      }
    })
    return cpt
  }
  getPendingCountBe(){
    let cpt = 0
    this.listUsers.map((user:any)=>{
      if(user.approved_be == '0'){
        cpt++
      }
    })
    return cpt
  }
  getPendingCountCf(){
    let cpt = 0
    this.listUsers.map((user:any)=>{
      if(user.approved_cf == '0'){
        cpt++
      }
    })
    return cpt
  }
}
