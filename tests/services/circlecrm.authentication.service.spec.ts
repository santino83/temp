import {CirclecrmAuthModule} from "../../src/circlecrm-auth.module";
import {TestBed} from "@angular/core/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CirclecrmAuthenticationService} from "../../src/circlecrm-authentication.service";

describe('CirclecrmAuthenticationService', () =>{

    const digest = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MjMzOTAwM' +
        'jUsImp0aSI6IkhcL0UrejdmcGRqc09ZcVdieFhXQ0ZGK2RtNjNTQ2x3SzE1UmI3XC9yYklG' +
        'VmRjNlc4UmxOUG5Sd1FRejJNSEhOVkJaT3BBUGJHT04xZUg0UEtLWUs0dkE9PSIsImlzcyI6I' +
        'iIsIm5iZiI6MTUyMzM5MDAyNSwiZXhwIjoxNTIzMzkwNjI1LCJkYXRhIjoie1wiYXR0cmlidXRl' +
        'c1wiOntcImZpcnN0bmFtZVwiOlwidGVzdFwiLFwiY3JlYXRlZFwiOlwiMjAxOC0wMi0yN1QxMTox' +
        'NTowOSswMTowMFwiLFwiaXNBY3RpdmVcIjpcInRydWVcIixcInRva2VuXCI6XCJlZTZkM2EwNjY2' +
        'MzhlYWNjZTRmNmU5YjEwZGFkYWUxZDQ3NzMxYWIwOTIxZDc4MTJhZGQ3Yjk0YzhjNDlmNjNkXCIs' +
        'XCJsYXN0bmFtZVwiOlwidGVzdFwiLFwidW5pdFwiOntcInVwZGF0ZWRcIjpcIjIwMTYtMDItMDFUM' +
        'Tg6MzU6MjArMDA6MDBcIixcIm5hbWVcIjpcIkV1cm9wZVwiLFwiY3JlYXRlZFwiOlwiMjAxNi0wMi' +
        '0wMVQxODozNToyMCswMDowMFwiLFwicmVmXCI6XCJcIixcImlkXCI6XCJkMmU0ZTMzNi04ZmJlLTQ4' +
        'MTktYmU1YS0wYWQ4NmM1MzkwODJcIn0sXCJjb21wYW55SWRcIjpcIjdjZWJhNDJkLTcxYWQtNGI3ZC1' +
        'hZTIxLWM0N2NkYThjOGQzY1wiLFwic2VydmljZVwiOlt7XCJuYW1lXCI6XCJDUk0tVEVTVFwiLFwiaWR' +
        'cIjpcIjk0NWVkMmIyLTgzZTUtNDVhMi1hNTcwLTg1MDVkMzg0MjA5MlwiLFwidXJpXCI6XCJodHRwOlx' +
        'cXC9cXFwvbG9jYWxob3N0OjgwODBcXFwvZWFzeXBieC1jcm1cXFwvY2FzXCIsXCJ0YWdcIjpcIkNDLUN' +
        'STVwiLFwiZGVzY3JpcHRpb25cIjpcIlZlcnNpb25lIHRlc3RcXFwvc3ZpbHVwcG9cIixcImNyZWF0ZWR' +
        'cIjpcIjIwMTctMDUtMjBUMTU6MzI6MTMrMDA6MDBcIixcInVwZGF0ZWRcIjpcIjIwMTctMDUtMjNUMTQ' +
        '6MzI6NDcrMDA6MDBcIn0se1wibmFtZVwiOlwiREVNT19PTkxJTkVcIixcImlkXCI6XCI0ZmI2YzJlOS0' +
        '1NTliLTQ1ODMtOTA5NC1mYzVlYWY4OWYzZmFcIixcInVyaVwiOlwiaHR0cHM6XFxcL1xcXC9jcm0udm9' +
        'pcHRlY2guaXRcXFwvZWFzeXBieC1jcm1cXFwvY2FzXCIsXCJ0YWdcIjpcIkNDLUNSTVwiLFwiZGVzY3J' +
        'pcHRpb25cIjpcImRlbW8gb25saW5lXCIsXCJjcmVhdGVkXCI6XCIyMDE3LTA1LTIzVDE1OjUwOjI3KzA' +
        'wOjAwXCIsXCJ1cGRhdGVkXCI6XCIyMDE3LTA1LTIzVDE2OjQ0OjAwKzAwOjAwXCJ9LHtcIm5hbWVcIjp' +
        'cIkZBWC1TRVJWRVItQ1VSQVRPTE9cIixcImlkXCI6XCIwZmU0ZjUwNy0yYmQ5LTQ0YzctOWJjYy0wOGQ' +
        'yZTkzNGQzYzZcIixcInVyaVwiOlwiaHR0cDpcXFwvXFxcL2N1cmF0b2xvLmVhc3lwYnguaXRcIixcImR' +
        'lc2NyaXB0aW9uXCI6XCJMb2NhbCBmYXggc2VydmVyIHN0dWRpbyBjdXJhdG9sb1wiLFwiY3JlYXRlZFw' +
        'iOlwiMjAxNy0wMy0yOFQxMjo0NzozOSswMDowMFwiLFwidXBkYXRlZFwiOlwiMjAxNy0wMy0yOFQxMjo' +
        '0NzozOSswMDowMFwifSx7XCJuYW1lXCI6XCJERVZcIixcImlkXCI6XCI2N2FhMzJmNC0wNzA2LTQwZjE' +
        'tYmYwYy0xOTlhMTY4OTI4MWVcIixcInVyaVwiOlwiaHR0cDpcXFwvXFxcL2NkYy52b2lwdGVjaC5pdFw' +
        'iLFwiZGVzY3JpcHRpb25cIjpcIlZlcnNpb25lIFN2aWx1cHBvXCIsXCJjcmVhdGVkXCI6XCIyMDE2LTA' +
        '2LTIxVDA5OjMxOjAxKzAwOjAwXCIsXCJ1cGRhdGVkXCI6XCIyMDE2LTA2LTIxVDA5OjMxOjAxKzAwOjA' +
        'wXCJ9LHtcIm5hbWVcIjpcIndlYmFwcC1jaXJjbGVjcm0taXRcIixcImlkXCI6XCJiZjM1ZGVkOC0xNTl' +
        'kLTRhYzMtYjNkYi0yMzQzZWVhNDMwYzVcIixcInVyaVwiOlwiaHR0cHM6XFxcL1xcXC93ZWJhcHAuY2l' +
        'yY2xlY3JtLml0XFxcL1wiLFwidGFnXCI6XCJDQ00tVVBPUlRBTFwiLFwiZGVzY3JpcHRpb25cIjpcIkN' +
        'pcmNsZUNSTSBVc2VyIFBvcnRhbFwiLFwiY3JlYXRlZFwiOlwiMjAxNi0wNC0xMlQxNzoxNDozOSswMDo' +
        'wMFwiLFwidXBkYXRlZFwiOlwiMjAxOC0wMi0yMVQxNjoyOTo0NyswMDowMFwifSx7XCJuYW1lXCI6XCJ' +
        '1c2VycG9ydGFsIGJhY2tlbmQgbG9jYWxcIixcImlkXCI6XCIxODM2Yjc2MC01ZmVhLTQwNmItOWRiOS1' +
        'iYzI0MWUzNTM5MjdcIixcInVyaVwiOlwiaHR0cDpcXFwvXFxcL3VzZXJwb3J0YWwtYmFja2VuZC5sb2N' +
        'hbFxcXC9hcHBfZGV2LnBocFxcXC9cIixcImRlc2NyaXB0aW9uXCI6XCJ1c2VycG9ydGFsIGJhY2tlbmQ' +
        'gbG9jYWxcIixcImNyZWF0ZWRcIjpcIjIwMTYtMDktMjFUMTY6NTg6MDArMDA6MDBcIixcInVwZGF0ZWR' +
        'cIjpcIjIwMTYtMTAtMjRUMTc6MDI6MzcrMDA6MDBcIn0se1wibmFtZVwiOlwiQ0MtRkFYXCIsXCJpZFw' +
        'iOlwiNzkyYjgxNjktYjJlMi00MDEzLWI2MzctMjhkNmM5NmI4NWQ2XCIsXCJ1cmlcIjpcImh0dHBzOlx' +
        'cXC9cXFwvZmF4LnZvaXB0ZWNoLml0XFxcL0VCTUlcIixcInRhZ1wiOlwiQ0MtRkFYXCIsXCJkZXNjcml' +
        'wdGlvblwiOlwiQ2xvdWQgQ29tbXVuaWNhdG9yIEZheCBTeXN0ZW1cIixcImNyZWF0ZWRcIjpcIjIwMTY' +
        'tMDItMTVUMTU6MDQ6MDYrMDA6MDBcIixcInVwZGF0ZWRcIjpcIjIwMTYtMTEtMjJUMTM6Mjk6MTcrMDA' +
        '6MDBcIn0se1wibmFtZVwiOlwiQ0MtQ09OVEFDVFNcIixcImlkXCI6XCI4ZmEzOWM2MC0wMzMzLTRlZWU' +
        'tOWJhNy04MDEzNjEwZWYyMzdcIixcInVyaVwiOlwiaHR0cHM6XFxcL1xcXC9jb250YWN0cy5jaXJjbGV' +
        'jcm0uaXRcXFwvYXBpXCIsXCJ0YWdcIjpcIkNDLUNPTlRBQ1RcIixcImRlc2NyaXB0aW9uXCI6XCJWb2l' +
        'wdGVjaCBDb250YWN0c1wiLFwiY3JlYXRlZFwiOlwiMjAxNi0wMi0xMVQxODoxNDozMSswMDowMFwiLFw' +
        'idXBkYXRlZFwiOlwiMjAxOC0wMi0yMVQxNjozMTo1NyswMDowMFwifSx7XCJuYW1lXCI6XCJlYXN5cGJ' +
        '4LWxvY2FsLXRlc3RcIixcImlkXCI6XCI3N2Q3YTY1ZS0yY2YwLTQ2YzEtOWIyMS0yZTBhYTM2NzQ2NjF' +
        'cIixcInVyaVwiOlwiaHR0cDpcXFwvXFxcL2xvY2FsaG9zdDo4MDAwXCIsXCJkZXNjcmlwdGlvblwiOlw' +
        'iZWFzeXBieCBsb2NhbCB0ZXN0IGRldmVsb3BtZW50XCIsXCJjcmVhdGVkXCI6XCIyMDE3LTA3LTE4VDE' +
        'zOjA2OjM1KzAwOjAwXCIsXCJ1cGRhdGVkXCI6XCIyMDE3LTA3LTE4VDEzOjA2OjM1KzAwOjAwXCJ9LHt' +
        'cIm5hbWVcIjpcIlBieFwiLFwiaWRcIjpcIjQ1ODRhYzZlLTJmMTEtNGU1OC1iZWMyLTg5YjIxOTRmN2V' +
        'iOVwiLFwidXJpXCI6XCJodHRwczpcXFwvXFxcL3BieC5jaXJjbGVjcm0uaXRcXFwvc3NvXFxcL3ZhdXR' +
        'oXFxcL2Z3ZFwiLFwidGFnXCI6XCJDSVJDTEUtUEJYXCIsXCJkZXNjcmlwdGlvblwiOlwiQ2lyY2xlQ1J' +
        'NIFBieCBQb3J0YWxcIixcImNyZWF0ZWRcIjpcIjIwMTctMDctMThUMTA6MTM6MTIrMDA6MDBcIixcInV' +
        'wZGF0ZWRcIjpcIjIwMTgtMDQtMDZUMTE6MjA6NDcrMDA6MDBcIn1dLFwidW5pdElkXCI6XCJkMmU0ZTM' +
        'zNi04ZmJlLTQ4MTktYmU1YS0wYWQ4NmM1MzkwODJcIixcImNvbXBhbnlcIjp7XCJjcmVhdGVkXCI6XCI' +
        'yMDE2LTAyLTAxVDE4OjM1OjIwKzAwOjAwXCIsXCJuYW1lXCI6XCJWb2lwdGVjaCBzLnIubC5cIixcIml' +
        'kXCI6XCI3Y2ViYTQyZC03MWFkLTRiN2QtYWUyMS1jNDdjZGE4YzhkM2NcIixcImxvZ29cIjpcImh0dHA' +
        '6XFxcL1xcXC9hdXRoLnZvaXB0ZWNoLml0XFxcL2ltYWdlc1xcXC9jb21wYW5pZXNcXFwvbG9nb3NcXFw' +
        'vNTc1MDQ4MjYyYWQ1ZC5wbmdcIixcInZhdFwiOlwiSVQxMTAwNDEzMTg4XCIsXCJ1cGRhdGVkXCI6XCI' +
        'yMDE2LTA2LTAyVDE0OjUyOjIyKzAwOjAwXCIsXCJmYXZpY29cIjpcImh0dHA6XFxcL1xcXC9hdXRoLnZ' +
        'vaXB0ZWNoLml0XFxcL2ltYWdlc1xcXC9jb21wYW5pZXNcXFwvZmF2aWNvc1xcXC81NzQzMzVmMjZjZTE' +
        '4LmpwZ1wifSxcImlkXCI6XCIyOTFlODBiMi00NGVlLTQyZDAtYTZjZS1iY2IyNDY2NGUxZDVcIixcInV' +
        'wZGF0ZWRcIjpcIjIwMTgtMDMtMTlUMTk6MzI6MjcrMDE6MDBcIixcImVtYWlsXCI6XCJ0ZXN0QHZvaXB' +
        '0ZWNoLml0XCIsXCJncm91cFwiOlt7XCJpZFwiOlwiZGM1OTU3NWUtZDFjOS00MmEwLThmMGEtNGVkNDl' +
        'jNzNjMmNlXCIsXCJuYW1lXCI6XCJDUk0gVVNFUlwiLFwidXBkYXRlZFwiOlwiMjAxNy0wNS0yM1QxMTo' +
        'xMDo0MyswMDowMFwiLFwiY3JlYXRlZFwiOlwiMjAxNy0wNS0yM1QxMToxMDo0MyswMDowMFwiLFwicmV' +
        'mXCI6XCJVU0VSU1wifSx7XCJpZFwiOlwiNGQ1Y2ViMmEtMThiOS00NzRiLTgzZTItMDYyZjEyN2NjYjc' +
        'yXCIsXCJuYW1lXCI6XCJNQVJLRVRJTkdcIixcInVwZGF0ZWRcIjpcIjIwMTgtMDItMjZUMTA6MzY6Mzc' +
        'rMDA6MDBcIixcImNyZWF0ZWRcIjpcIjIwMTctMDQtMTJUMTQ6MTg6MDcrMDA6MDBcIixcInJlZlwiOlw' +
        'iXCJ9LHtcImlkXCI6XCJmMzA5YmEyOC03ZGU5LTRhOTctYmYyZi0wYTI5NTkwYWZjMmJcIixcIm5hbWV' +
        'cIjpcIkNSTSBBRE1JTlNcIixcInVwZGF0ZWRcIjpcIjIwMTctMDUtMjNUMTE6MDI6NTYrMDA6MDBcIix' +
        'cImNyZWF0ZWRcIjpcIjIwMTctMDUtMjNUMTE6MDI6MTQrMDA6MDBcIixcInJlZlwiOlwiQURNSU5TXCJ' +
        '9XX0sXCJyb2xlXCI6W3tcIm5hbWVcIjpcIlZBVVRIX0JBU0lDXCIsXCJpZFwiOlwiYzU3MWZhNjAtOTZ' +
        'mNi00NzAxLTgyZGItY2Y1YzhlZDQ4MmI4XCIsXCJyZWZcIjpcIlZBVVRIX0JBU0lDXCIsXCJjcmVhdGV' +
        'kXCI6XCIyMDE2LTA0LTEyVDE4OjAwOjI4KzAwOjAwXCIsXCJ1cGRhdGVkXCI6XCIyMDE2LTA0LTEyVDE' +
        '4OjAwOjI4KzAwOjAwXCJ9LHtcIm5hbWVcIjpcIkNpcmNsZUNSTSBQbGF0Zm9ybSBVc2VyXCIsXCJpZFw' +
        'iOlwiZmUyYjNmOWEtNDMzYy00OTFmLWFjMDMtOTk0OTZiYmFkYzkzXCIsXCJyZWZcIjpcIkNJUkNMRUN' +
        'STV9QTEFURk9STV9VU0VSXCIsXCJjcmVhdGVkXCI6XCIyMDE4LTAzLTE5VDE3OjM1OjQ5KzAwOjAwXCI' +
        'sXCJ1cGRhdGVkXCI6XCIyMDE4LTAzLTE5VDE3OjM1OjQ5KzAwOjAwXCJ9LHtcIm5hbWVcIjpcIkRFVkV' +
        'MT1BFUlwiLFwiaWRcIjpcIjNjYTJjZTg5LTc1MjEtNDE1Ny1iMWU0LTZhNGNiYzFkYzYzZVwiLFwiY3J' +
        'lYXRlZFwiOlwiMjAxNi0wMi0xMVQxODowODoyMCswMDowMFwiLFwidXBkYXRlZFwiOlwiMjAxNi0wMi0' +
        'xMVQxODowODozOCswMDowMFwifSx7XCJuYW1lXCI6XCJVU0VSXCIsXCJpZFwiOlwiMjY1ODRjYjgtZGQ' +
        'wMC00YjY5LWIxOWYtZThkMTg0Y2M2Y2FkXCIsXCJjcmVhdGVkXCI6XCIyMDE2LTAyLTExVDE4OjA2OjE' +
        '3KzAwOjAwXCIsXCJ1cGRhdGVkXCI6XCIyMDE2LTAyLTExVDE4OjA2OjE3KzAwOjAwXCJ9XSxcInVzZXJ' +
        'uYW1lXCI6XCJ0ZXN0QHZvaXB0ZWNoLml0XCJ9In0.XYtCQlKLDIBfnYaFIImnRtYLSHicqDkOrdj9S1op2zU';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                CirclecrmAuthModule.forRoot({
                    redirectURL: 'http://localhost:4200',
                    remoteBaseURL: 'https://foo.ext'
                })
            ]
        });
    });

    it('should decode token', () => {
       const authService: CirclecrmAuthenticationService = TestBed.get(CirclecrmAuthenticationService);
       expect(authService.authenticate(digest)).not.toBeNull();
       const token = authService.token;
       expect(token).not.toBeNull();
    });

});