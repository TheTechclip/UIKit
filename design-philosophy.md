# 설계 철학

> 상태: 정본(Normative)
>
> 적용 범위: Musecat3-Next, UIKit, FunctionKit의 신규 설계와 변경 검토

이 문서는 세 저장소가 공유하는 판단 기준을 정의한다. 세부 규약은 이 원칙을
구체화할 수 있지만 조용히 다시 정의할 수 없다. 현재 구현이 이 원칙과 다르면 그
차이는 선례가 아니라 [`migration/`](./migration/README.md)의 이행 항목이다.

## 1. 소유권이 구현 방식보다 먼저다

코드는 실행할 수 있는 위치가 아니라 책임을 설명할 수 있는 가장 가까운 소유자에
둔다.

- 경로는 제품·도메인·런타임 소유권을 밝힌다.
- 모듈은 공개 namespace와 변경 경계를 만든다.
- symbol은 경로와 모듈이 이미 제공한 문맥을 반복하지 않고 즉시 역할만 말한다.
- 편의를 위한 `utils`, `helpers`, `misc`, 무제한 `common`은 소유권을 대신할 수 없다.

기능을 옮길 때는 파일 이름보다 먼저 상태, 정책, I/O, 표현 중 누가 무엇을
소유하는지 결정해야 한다.

## 2. 제품 정책과 범용 메커니즘을 분리한다

공유 패키지는 특정 제품 흐름을 알면 안 된다.

| 경계 | 소유하는 것 | 소유하지 않는 것 |
| --- | --- | --- |
| FunctionKit | 제품 중립 함수, hook, 브라우저·런타임 유틸리티 | Musecat 정책, 문구, 라우팅, 시각 디자인 |
| UIKit | 시각 primitive, token, 접근성, 범용 상호작용 surface | 제출 API, 도메인 validation, Next.js 라우팅 |
| frontend | 제품 UI 상태, validation, interaction, surface 조합 | 비밀값, 공급자 SDK, 서버 데이터 접근 |
| backend | 제품 정책, 서버 use case, 외부 공급자 연동 | Dialog, toast, 브라우저 상태 |
| app | URL, Next.js adapter, 서버 로딩, surface 조합 | 재사용 기능 상태, 공급자 세부 구현 |

범용 기능이 부족하면 애플리케이션에 복제본을 만들지 않는다. 필요한 계약을
FunctionKit 또는 UIKit에 추가하고, 제품 고유 정책만 애플리케이션에 남긴다.

## 3. 기능은 표현 surface와 독립적이어야 한다

하나의 기능은 Page, Dialog, Intercepting Route 중 어디에 놓여도 핵심 상태와 동작이
같아야 한다.

- 기능은 필요할 때 `Root`, `Header`, `Content`, `Actions`를 소유한다.
- `Page`는 기능 전체를 일반 페이지에 배치한다.
- `Dialog` adapter는 기능 전체와 Dialog 설정을 조합한다.
- `app`의 `RouteModal`은 완성된 Dialog를 URL과 navigation lifecycle에 연결한다.
- UIKit Dialog는 기능 상태나 Next.js route를 소유하지 않는다.

`Content`만 떼어 modal에 넣거나, 기능이 Dialog store ID와 animation duration을 알아야
한다면 경계가 잘못된 것이다.

## 4. 런타임 경계는 추론하게 두지 않는다

서버, 클라이언트, universal 코드는 파일과 import graph에서 드러나야 한다.

- universal 모듈은 일반 `.ts`를 사용한다.
- Client Component 진입점은 `"use client"`를 사용한다. component나 `use` hook 이름으로
  runtime이 이미 분명하지 않은 standalone browser utility는 `.client.ts(x)`도 사용한다.
- 비밀값, 서버 SDK, 파일 시스템을 사용하는 진입점은 `.server.ts(x)`와
  `server-only` 경계를 사용한다.
- Server Component에서 Client Component로 넘기는 값은 직렬화 가능한 계약이어야
  한다.
- `frontend`는 `backend`를 import하지 않는다. `app`이 두 경계를 조합한다.

`.shared.ts`는 안전성을 증명하지 못하고 모호함만 추가하므로 사용하지 않는다.

## 5. 공개 API는 의도적으로 작게 유지한다

파일 트리는 공개 API가 아니다.

- npm 소비자는 package root의 named export를 기본으로 사용한다.
- subpath는 stylesheet나 명확한 런타임 격리처럼 독립 진입점이 실제로 필요할 때만
  `package.json#exports`에 열거한다.
- wildcard export와 외부 deep import는 금지한다.
- feature 외부 소비자는 명시적 module facade를 사용하고, 내부에서는 구체 파일을
  직접 import한다.
- 공개 API의 제거·이름 변경·기본값 변경은 migration과 호환성 판단을 동반한다.

검색 가능성을 이유로 모든 내부 helper를 export하지 않는다. 발견 가능성은 좋은
인덱스와 reference 문서로 해결한다.

## 6. 상태와 부수 효과는 가장 가까운 공통 소유자에 둔다

- feature 상태는 해당 feature root가 소유한다.
- renderer는 표현 상태만 소유한다.
- 서버 service는 use case를 조율하고 provider는 외부 프로토콜을 처리한다.
- import만으로 요청, 전역 listener 등록, 상태 변경이 발생하면 안 된다.
- React render 중 다른 component 상태를 변경하지 않는다.
- parsing, validation, execution, mapping을 구분하고 부수 효과 경계를 드러낸다.

전역 store는 여러 독립 소비자가 같은 수명을 공유해야 할 때만 사용한다. 단순히 prop을
전달하기 싫다는 이유로 전역화하지 않는다.

## 7. 시간 추측 대신 lifecycle 신호를 사용한다

animation, request, cleanup처럼 완료 시점이 중요한 동작은 실제 소유자가 신호를
제공해야 한다.

- 소비자가 다른 모듈의 duration을 복사하거나 fallback timer를 만들지 않는다.
- close request, guard, state transition, visual exit, cleanup을 서로 다른 단계로 본다.
- 중복 요청, 취소, reopen, unmount에서 stale callback이 발생하지 않아야 한다.
- 비동기 동작은 pending, success, failure, cancellation 계약을 명시한다.

## 8. 디자인 시스템과 접근성은 선택 사항이 아니다

Musecat UI는 UIKit primitive와 token을 사용한다.

- 구조는 `View`, 상호작용은 `Pressable`, 이미지는 `ImageView`를 우선한다.
- 색, 간격, radius, border, shadow, motion은 UIKit token과 공개 prop을 사용한다.
- 애플리케이션의 CSS/SCSS 우회는 UIKit 계약의 누락을 숨기지 않는다.
- focus, keyboard, semantic role, ARIA, reduced motion, scroll lock은 구현 완료 조건이다.
- visual regression은 typecheck나 build 성공만으로 검증되었다고 말하지 않는다.

OpenGraph의 Satori 호환 inline style처럼 런타임 제약이 명확한 예외는 해당 문서에 범위와
이유를 기록한다.

## 9. 계약을 테스트하고 같은 변경에서 문서화한다

테스트는 구현 줄이 아니라 관찰 가능한 계약을 고정한다.

- pure rule은 입력·출력·오류를 unit test로 검증한다.
- component와 hook은 상태 변화, cleanup, 접근성, 실패 경로를 검증한다.
- route surface는 direct load, refresh, soft navigation, back/forward를 검증한다.
- public API 변경은 구현, 타입, export, 테스트, README 예제, reference를 같은 변경에서
  갱신한다.
- 브라우저 검증을 하지 못했다면 build 검증과 구분해 기록한다.

## 10. 마이그레이션 기록은 설계 선례가 아니다

레거시 파일명, 임시 re-export, placeholder, 중간 의존성은 최종 구조의 예가 아니다.

- 장기 규약은 `/docs`에 둔다.
- 현재 이행 순서, 알려진 위반, 임시 호환성은 `/docs/migration`에만 둔다.
- 완료된 이행 항목은 확인 근거를 남긴 뒤 제거하거나 완료 상태로 축약한다.
- 정본 문서에는 열린 질문이나 작업 queue를 섞지 않는다.

## 판단 질문

설계 검토 전에 다음을 순서대로 확인한다.

1. 이 상태와 정책의 실제 소유자는 누구인가?
2. 서버·클라이언트·universal 경계가 import graph에 보이는가?
3. 기능이 Page와 Dialog 양쪽에서 같은 계약으로 작동하는가?
4. 공개 API가 내부 파일 구조를 불필요하게 노출하는가?
5. 이미 UIKit 또는 FunctionKit이 제공하는 기능을 복제하는가?
6. 완료 시점을 timer로 추측하거나 다른 모듈의 내부 상수를 아는가?
7. 실패·취소·cleanup·접근성 계약을 테스트할 수 있는가?
8. 현재의 예외가 정본이 아니라 migration 항목으로 기록되어 있는가?
