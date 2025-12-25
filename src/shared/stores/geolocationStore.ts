
export const geolocationStore = {
    geoFindMe() {
        function success(position: any) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(latitude, longitude);
        }

        function error() {
            console.log("현재 위치를 가져올 수 없음");
        }

        if (!navigator.geolocation) {
            console.log("브라우저가 위치 정보를 지원하지 않음");
        } else {
            navigator.geolocation.getCurrentPosition(success, error);
        }
    }
}
