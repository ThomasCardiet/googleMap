import { Component, ElementRef, ViewChild } from '@angular/core';
import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';
import { LatLng } from '@capacitor-community/capacitor-googlemaps-native/dist/esm/types/common/latlng.interface';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('map') mapView: ElementRef;

  constructor(private alertCtrl: AlertController) { }


  ionViewDidEnter() {
    this.createMap();
  }

  createMap() {
    const boundingRect = this.mapView.nativeElement.getBoundingClientRect() as DOMRect;
    // console.log(boundingRect);
    // alert(boundingRect);

    CapacitorGoogleMaps.create({
      width: Math.round(boundingRect.width),
      height: Math.round(boundingRect.height),
      x: Math.round(boundingRect.x),
      y: Math.round(boundingRect.y),
      latitude: 10,
      longitude: 10,
      zoom: 2,
      liteMode: false,
    });

    CapacitorGoogleMaps.addListener('onMapReady', async () => {
      CapacitorGoogleMaps.setMapType({
        type: "hybrid"
      });
      this.showCurrentLocation();
    });

    CapacitorGoogleMaps.addListener('didTapPOIWithPlaceID', async (ev) => {
      const result = ev.results;

      const alert = await this.alertCtrl.create({
        header: result.name,
        message: `Place ID:  ${result.placeID}`,
        buttons: ['OK']
      });

      await alert.present();
    });



  }
  showCurrentLocation() {
    Geolocation.requestPermissions().then(async permission => {
      const coordinate = await Geolocation.getCurrentPosition();
      // alert(coordinate.coords.altitude+" hello "+coordinate.coords.longitude);
      // latitude: 53.355127,
      // longitude: -6.266689,
      CapacitorGoogleMaps.addMarker({
        latitude: coordinate.coords.latitude,
        longitude: coordinate.coords.longitude,
        title: "because I'm tout seul",
        snippet: "sans amiiiii",
      });

      // CapacitorGoogleMaps.setCamera({
      //   latitude: 10,
      //   longitude: 10,
      //   zoom: 12,
      //   bearing: 0,
      // });
    });
  }

  draw() {
    Geolocation.requestPermissions().then(async permission => {
      const coordinate = await Geolocation.getCurrentPosition();
      const points: LatLng[] = [
        {
          latitude: coordinate.coords.latitude,
          longitude: coordinate.coords.longitude,
        },
        {
          latitude: 55,
          longitude: 10,
        }
      ];

      CapacitorGoogleMaps.addPolyline({
        points,
        color: '#ff00ff',
        width: 2,
        zIndex: 0,
        visibility: true,
      });
    });
  }
}
