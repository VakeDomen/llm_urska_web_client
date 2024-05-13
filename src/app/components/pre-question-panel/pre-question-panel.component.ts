import { Component, EventEmitter, OnInit, Output } from '@angular/core';


interface Pile {
  selector: string,
  label: string,
  active: boolean,
}

@Component({
  selector: 'app-pre-question-panel',
  templateUrl: './pre-question-panel.component.html',
  styleUrl: './pre-question-panel.component.sass'
})
export class PreQuestionPanelComponent implements OnInit {
  
  @Output() pileUpdate: EventEmitter<string> = new EventEmitter();
  
  public piles: Pile[] = [
    {
      selector: "urska_m3_shard_general",
      label: "General information",
      active: true,
    } as Pile,
    {
      selector: "urska_m3_shard_bachelor",
      label: "Undergraduate",
      active: true,
    } as Pile,
    {
      selector: "urska_m3_shard_masters",
      label: "Masters",
      active: false,
    } as Pile,
    {
      selector: "urska_m3_shard_phd",
      label: "PhD",
      active: false,
    } as Pile,
    {
      selector: "urska_m3_shard_staff",
      label: "Staff",
      active: false,
    } as Pile,
    {
      selector: "urska_m3_shard_erasmus",
      label: "Mobility/Erasmus",
      active: false,
    } as Pile,
  ]


  ngOnInit(): void {
    this.emitCheck();
  }

  public emitCheck() {
    const selectorString = this.piles.filter(p => p.active).map(p => p.selector).join(",");
    this.pileUpdate.emit(selectorString)
  }

}
