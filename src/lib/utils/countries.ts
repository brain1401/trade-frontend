/**
 * @file 국가 정보 관련 유틸리티 함수
 */
import {
  countryNameAndCodeMap,
  type CountryCode,
  type CountryName,
} from "@/data/countries";

/**
 * 국가명(한글)을 받아 해당하는 UN M49 숫자 코드를 반환함.
 *
 * @param name 국가명 (타입: CountryName)
 * @returns 국가 코드 (타입: CountryCode)
 * @example
 * const koreaCode = getCountryCode("대한민국"); // "410"
 */
export const getCountryCode = (name: CountryName): CountryCode => {
  return countryNameAndCodeMap[name];
};
