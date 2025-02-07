import { ISSUE_STATUS } from './constant.js';
import { getIssueItemTpl, getIssueTpl } from './tpl';
import { API_ENDPOINT } from './urls.js';
import { pipe } from './util.js';

const appEl = document.querySelector('#app');
appEl.innerHTML = getIssueTpl();

const issueListEl = document.querySelector('.issue-list ul');
const openedTabEl = document.querySelector('.open-count');
const closedTabEl = document.querySelector('.close-count');

const getIssueList = async () => {
  const res = await fetch(API_ENDPOINT.ISSUE_LIST);
  const data = res.json();

  return data;
};

const filterItem = (status) => (items) => items.filter((item) => item.status === status);

const createTemplate = (issueList) => issueList.map((item) => getIssueItemTpl(item));

const joinArrayValues = (array) => array.join('');

const renderItems = (element) => {
  issueListEl.innerHTML = element;
};

const renderCount = (status) => (count) => {
  const template = status === ISSUE_STATUS.OPEN ? `${count} Opens` : `${count} Closed`;
  const el = status === ISSUE_STATUS.OPEN ? openedTabEl : closedTabEl;

  el.innerHTML = template;
};

const renderOpenedCount = renderCount(ISSUE_STATUS.OPEN);

const renderClosedCount = renderCount(ISSUE_STATUS.CLOSE);

const highlightTab = (selectedTab) => {
  if (selectedTab === ISSUE_STATUS.OPEN) {
    openedTabEl.classList.add('font-bold');
    closedTabEl.classList.remove('font-bold');

    return;
  }

  if (selectedTab === ISSUE_STATUS.CLOSE) {
    closedTabEl.classList.add('font-bold');
    openedTabEl.classList.remove('font-bold');
  }
};

const renderIssueList = (status) =>
  pipe(filterItem(status), createTemplate, joinArrayValues, renderItems);

const renderOpenedIssueList = renderIssueList(ISSUE_STATUS.OPEN);

const renderClosedIssueList = renderIssueList(ISSUE_STATUS.CLOSE);

const init = async () => {
  const items = await getIssueList();
  const openedIssueCount = items.filter((item) => item.status === ISSUE_STATUS.OPEN).length;
  const closedIssueCount = items.filter((item) => item.status === ISSUE_STATUS.CLOSE).length;

  renderOpenedIssueList(items);
  renderOpenedCount(openedIssueCount);
  renderClosedCount(closedIssueCount);
  highlightTab(ISSUE_STATUS.OPEN);
};

const handleClickOpenedTab = async () => {
  const items = await getIssueList();
  renderOpenedIssueList(items);
  highlightTab(ISSUE_STATUS.OPEN);
};

const handleClickClosedTab = async () => {
  const items = await getIssueList();
  renderClosedIssueList(items);
  highlightTab(ISSUE_STATUS.CLOSE);
};

await init();
openedTabEl.addEventListener('click', handleClickOpenedTab);
closedTabEl.addEventListener('click', handleClickClosedTab);
