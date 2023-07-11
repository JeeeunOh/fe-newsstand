import { getJSON } from "./data.js";
import { TOPIC } from "../constant.js";

/**
 * 핫토픽 5개씩 요소 추가하기
 */
const setHotTopic = async () => {
  const $hotTopicLeft = document.querySelector(".hot-topic-left");
  const $hotTopicRight = document.querySelector(".hot-topic-right");

  let hotTopic = await getJSON("../assets/hotTopic.json");

  hotTopic.forEach((topic, idx) => {
    const $li = document.createElement("li");
    $li.classList.add("hot-topic_list");

    // 0번째 li => prev, 1번째 li => current, 4번째 li => next
    if (idx % TOPIC.SECTION_NUM === 0) $li.classList.add("prev");
    else if (idx % TOPIC.SECTION_NUM === 1) $li.classList.add("current");
    else if (idx % TOPIC.SECTION_NUM === 2) $li.classList.add("next");

    const $h2 = document.createElement("h2");
    $h2.classList.add("hot-topic_list_title");
    $h2.innerText = topic.title;

    const $p = document.createElement("p");
    $p.classList.add("hot-topic_list_content");
    $p.innerText = topic.content;

    $li.append($h2, $p);

    idx < TOPIC.SECTION_NUM
      ? $hotTopicLeft.append($li)
      : $hotTopicRight.append($li);
  });
};

/**
 * 핫토픽 롤링하는 함수
 * -> 5초에 한번씩 가장 위에 있는 뉴스 하위로 가져옴.
 */

const rollingTopic = () => {
  // 토픽 롤링 타이머 세팅
  document.addEventListener("DOMContentLoaded", () => {
    let leftInterval = null,
      rightInterval = null;
    leftInterval = startRolling("hot-topic-left");

    setTimeout(() => {
      rightInterval = startRolling("hot-topic-right");
    }, TOPIC.ROLLING_TIME_GAP);

    // 마우스 호버 시 타이머 리셋
    const $hotTopicLeft = document.querySelector(".hot-topic-left");
    $hotTopicLeft.addEventListener("mouseenter", () => {
      clearInterval(leftInterval);
    });
    $hotTopicLeft.addEventListener("mouseleave", () => {
      leftInterval = startRolling("hot-topic-left");
    });

    const $hotTopicRight = document.querySelector(".hot-topic-right");
    $hotTopicRight.addEventListener("mouseenter", () => {
      clearInterval(rightInterval);
    });
    $hotTopicRight.addEventListener("mouseleave", () => {
      leftInterval = startRolling("hot-topic-right");
    });
  });
};

/**
 * 핫토픽 롤링 시작
 */
const startRolling = (sectionClass) => {
  let interval = setInterval(() => {
    rollingCallback(sectionClass);
  }, TOPIC.ROLLING_TIME);

  return interval;
};

/**
 * 핫토픽 롤링 동작 함수
 */
const rollingCallback = (sectionClass) => {
  //.prev 클래스 삭제
  document.querySelector(`.${sectionClass} .prev`).classList.remove("prev");

  //.current -> .prev
  let current = document.querySelector(`.${sectionClass} .current`);
  current.classList.remove("current");
  current.classList.add("prev");

  //.next -> .current
  let next = document.querySelector(`.${sectionClass} .next`);
  // 다음 목록 요소 null 체크
  if (next.nextElementSibling === null) {
    // null 이면 첫번째 요소를 next
    document
      .querySelector(`.${sectionClass} .hot-topic_list:first-child`)
      .classList.add("next");
  } else {
    // null이 아니면, 목록 처음 요소를 다음 요소로 선택
    next.nextElementSibling.classList.add("next");
  }
  next.classList.remove("next");
  next.classList.add("current");
};

export { setHotTopic, rollingTopic };
