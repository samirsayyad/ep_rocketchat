const __extraHeightOfContainer = 317; // 132px shadow bottom conatiner + 185 px padding bottom1

const checkInView = (elem) => {
  const container = $('#toc');
  const docViewTop = container.scrollTop();
  const docViewBottom = docViewTop + (container.height() - __extraHeightOfContainer);

  const elemTop = $(elem).offset().top;
  const elemBottom = elemTop + $(elem).height();
  return {visible: ((elemBottom <= docViewBottom))}; // && (elemTop >= docViewTop)
};

const checkLastElement = (containerId) => {
  let targetElement;
  if (typeof containerId !== String) targetElement = $(containerId);
  else targetElement = $(`#${containerId}`).nextAll('[mentioned=true]').last();

  if (targetElement.length) {
    const elementStatus = checkInView(targetElement);
    return !elementStatus.visible;
  }
  return false;
};


export const newMentionHelper = (headerId) => {
  const rowContainer = $(`#${headerId}_container`);
  rowContainer.attr('mentioned', 'true');
  if (rowContainer.length && headerId !== 'general') {
    const elementStatus = checkInView(rowContainer, true);
    if (elementStatus.visible === false) {
      $('#bottomNewMention').css({display: 'block'});
    }
  }
};

export const removeNewMentionHelper = (headerId) => {
  const rowContainer = $(`#${headerId}_container`);
  if (rowContainer.length && headerId !== 'general') rowContainer.attr('mentioned', 'false');
};

export const handleNewMentionButton = () => {
  const handleScroll = () => {
    const lastScrolledMention = $('#tocItems').find('[mentioned=true]').last();
    if (lastScrolledMention) {
      if (checkLastElement(lastScrolledMention) === true) {
        $('#bottomNewMention').css({display: 'block'});
      } else {
        $('#bottomNewMention').css({display: 'none'});
      }
    }
  };

  const debounce = (method, delay) => {
    clearTimeout(method._tId);
    method._tId = setTimeout(() => {
      method();
    }, delay);
  };

  $('#toc').scroll(() => {
    debounce(handleScroll, 100);
  });

  $('#bottomNewMention').click(() => {
    const lastScrolledMention = $('#bottomNewMention').attr('_lastscrolled');
    if (lastScrolledMention) {
      const lastScrolledElement = $(`#${lastScrolledMention}`);
      const targetElement = lastScrolledElement.nextAll('[mentioned=true]').first();
      if (targetElement.length) {
        $('#bottomNewMention').attr('_lastscrolled', targetElement.attr('id'));
        $(targetElement)[0].scrollIntoView({
          behavior: 'smooth',
        });
      } else {
        $(lastScrolledElement)[0].scrollIntoView({
          behavior: 'smooth',
        });
      }
    } else {
      const mentionedItems = $('#tocItems').find('[mentioned=true]');
      mentionedItems.each(function (i) {
        const elementStatus = checkInView(this);
        if (elementStatus.visible === false) {
          $(this)[0].scrollIntoView({
            behavior: 'smooth',
          });

          $('#bottomNewMention').attr('_lastscrolled', this.id);
          if (i === (mentionedItems.length - 1)) {
            $('#bottomNewMention').css({display: 'none'});
          }
          return false;
        }
      });
    }
  });
};
