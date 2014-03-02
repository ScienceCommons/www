/**
 * @jsx React.DOM
 */

'use strict';

var _ = require('underscore');
var React = require('react/addons');
var SearchResults = require('./SearchResults.js');
var Spinner = require('./Spinner.js');

// taken from http://cognitrn.psych.indiana.edu/rgoldsto/cogsci/classics.html
var SampleResults = [
  {name: "Mental models in cognitive science", author: "Johnson-Laird, P. N.", blurb: "This article postulates that mental models differ from visual images and from propositional representations, and it presents evidence that corroborates the differences.   It argues that reasoners use propositional representations of, say, spatial descriptions to construct mental models.   It also argues that mental models rather than formal logic underlie syllogistic inference, e.g., some of the parents are drivers, all of the drivers are scientists, therefore, some of the parents are scientists.  The article was the first in a journal to present a case for mental models as the end result of comprehension and as the starting point of deductive reasoning.   This idea led to many subsequent investigations."},
  {name: "Categorization and representation of physics problems by experts and novices", author: "Chi, M. T. H., Feltovich, P., & Glaser, R.", blurb: "This is an experimental investigation of how experts and novices differ in the organization of their knowledge.  Expertise among physicists for classical mechanics is studied by formally measuring how people talk about, sort, and solve physics problems. The findings show that experts represent a given problem differently from novices.  That is, the experts represented a routine physics problem according to its underlying principle, whereas novices based their representation on the problem's literal features. This finding of deep versus shallow representation paved the way for many later studies of expertise in particular domains.  In addition to developing techniques for cognitive assessment that can be applied to almost any domain, the discussions of schemas, mental models, and problem solving skills have informed many subsequent analyses of educational practice, training, and individual differences."},
  {name: "Connectionist models and their properties", author: "Feldman, J. A., & Ballard, D. H.", blurb: "Although several researchers had worked with neurally-inspired computational models before 1982, this article was among the first to present a general and formal characterization of connectionist models. In fact, it introduced the term \"connectionist model\" to cognitive science. The authors provided formal results dealing with winner-take-all networks, coarse-coding, and the control of sequencing, and described the well known 100-time-step argument for the need for massively parallel computation. The specific approach taken by Feldman and Ballard is now represented by the many structured or localist connectionist models in the field."},
  {name: "Structure-mapping: A theoretical framework for analogy", author: "  Gentner, D.", blurb: "This paper introduces the structure-mapping theory of analogy and similarity. Analogy is seen as a mapping of knowledge between two domains that conveys that the same system of relations holds within the target domain as within the base domain. In interpreting an analogy, people seek to match relational structure; object correspondences are determined by like roles in the common relational structure, rather than by direct object-level similarities. The mapping process is guided by the implicit constraints of structural consistency - e.g.,  1-1 correspondence between elements of the base and elements of the target - and systematicity - a preference for mapping predicates that belong to a connected system of matching relations, rather than isolated predicates.  The theory provides a framework for differentiating kinds of similarity match, such as analogy, literal similarity, and relational abstraction matches. Structure-mapping has had a large influence on research in analogy and similarity and has informed research in broader arenas such as learning and categorization."},
  {name: "Feature discovery by competitive learning", author: "Rumelhart, D. E., & Zipser, D.", blurb: "This article describes a novel algorithm for training neural networks without requiring any external teacher or feedback.  Instead, the neural network becomes trained on the basis of the statistics latent in the stimuli presented to the network.  The algorithm works by starting with homogenous, undifferentiated detectors.  When an input pattern is presented, the detector that is most similar to the pattern adapts itself so that it becomes even more tuned to the pattern.  The remaining detectors are prevented from adapting to the pattern, leaving them available to become specialized to other patterns.  In this manner, the algorithm achieves one of the primary goals of cognitive science - the creation of systems that organize themselves with training so that they exhibit richer structure than their original starting configuration.   Sample simulations apply the algorithm to pattern formation and recognition, the automatic generation of categories and features, and the integration of data-driven and top-down influences on category formation."},
  {name: "Why a diagram is (sometimes) worth 10,000 word", author: "Larkin, J. H., & Simon, H. A.", blurb: "This article explores the different computational requirements and affordances of textual and diagrammatic information.  Differences between diagrams and informationally equivalent text passages are framed in terms of search (accessing information), recognition (matching information to knowledge in long-term memory), and inference (creating new knowledge).  Diagrams typically allow dramatically more efficient recognition than do equivalent text stimuli.  Spatial grouping can also facilitate search processes for diagrams.  This research has had an impact on our basic understanding of mental representations, in terms of what elements are explicitly versus implicitly available in a representation, the importance of describing representation/process PAIRS rather than representations alone, and the cognitive uses of different classes of representations.  Practically, this research has provided guidelines for determining how particular information should be conveyed to maximize its impact and usefulness."},
  {name: "Finding structure in time", author: "Elman, J. L.", blurb: "This article introduces the 'simple recurrent network' (SRN) archecture, which has been widely applied in problems involving serially ordered patterns.  Traditional feedfoward networks learn to map static inputs to outputs. However, there are many phenomena in which time figures as a critical dimension, and for which recurrent networks such as the SRN are useful.  In the SRN, internal states (\"hidden units\") feed back on to themselves at successive time steps. These recurrent connections provide the network with a memory that can be used for solving problems in which there is temporal structure. A number of simulations are reported in this paper in which the SRN is trained on a prediction task.  In the course of learning to predict various time series, the network learns things such as the implicit word boundaries between letter strings, or the semantic and syntactic categories that underlie an artificial grammar."},
  {name: "Principles of object perception", author: "Spelke, E. S.", blurb: "This article focuses on the capacities of human infants to perceive objects as unitary, bounded, and persisting bodies.  Special attention is given to the problem of perceiving objects in natural visual arrays, in which most objects are partly hidden by, and adjacent to, the surfaces and objects that surround them, and in which objects enter and leave the field of view as they, or the observer, move.  Drawing on experiments investigating infants' visual perception of adjacent and partly occluded objects, infants' haptic perception of the objects, and infants' apprehension of the persistence and identity of objects that move fully out of view, Spelke proposes that object perception results from an analysis of viewer-centered surface representations: an analysis that accords with a set of spatio-temporal principles that govern the behavior of all movable, solid bodies. The research reported in this article has markedly influenced thinking and subsequent research on the nature and development of object representations."},
  {name: "Task decomposition through competition in a modular connectionist architecture - the what and where vision tasks", author: "Jacobs, R. A., Jordan, M. I., & Barto, A. G.", blurb: "This article studies the question of how different components of a computational architecture can develop different functional specializations.  It describes a novel architecture consisting of multiple neural networks that compete for the right to learn each data item.  Given an input pattern, the network whose output is closest to the target output is allowed to do the most learning on that item.  Other networks learn little or nothing about the item. The tendency of the architecture is to partition the set of data items so that different networks learn different items and, thus, acquire different functions.  Sample simulations apply the architecture to the identification and localization of an object depicted in a visual image.  A lesson of this work is that modularity or at least functional specializations, need not be determined soley by genetic factors.  Instead, learning may also play a role in the functional organization of a modular system."},
  {name: "How A Cockpit Remembers its Speeds", author: " Hutchins E", blurb: "Do systems larger than single individuals qualify as \"cognitive?\" In this article, Hutchins argued that they do. He supported his claim by analyzing remembering by commercial airline cockpits, considered as cognitive systems. He proposed \"that rather than trying to map the findings of cognitive psychological studies of individuals directly onto the individual pilots in the cockpit, we should map the conceptualization of the cognitive system onto a new unit of analysis: the cockpit as a whole.\" Hutchins provided such an analysis, identifying ways in which cockpit operations are organized to include use and construction of symbolic and indexical representations. Like standard analyses of individual human cognition, Hutchins explained successful remembering in terms of representations that are internal in the cognitive system. However, these internal representations are mainly observable in the cockpit, rather than entering the analysis through subjects' verbal reports and the theorist's hypotheses, as in analyses of individual human cognition. Hutchins's functional analysis of remembering by the cockpit as a system provides constraints on hypotheses about cognitive processes at the level of individuals, the pilots. \"The memory of the cockpit, however, is not made primarily of pilot memory.\" Instead, as Hutchins showed, remembering is a function of the system, achieved through interaction of the pilots with the structures of material and informational systems of their flying machine."}
];

// CSS
require('../../styles/reset.css');
require('../../styles/main.css');

var Search = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      newSearch: "",
      loading: false
    };
  },
  runSearch: function() {
    var numResults = _.random(2, 8);
    var _this = this;
    if (_this.state.timeout)
      clearTimeout(_this.state.timeout);

    var timeout = setTimeout(function() {
      _this.setState({
        loading: false,
        results: _.sample(SampleResults, numResults)
      });
    }, 1000);

    _this.setState({
      currentSearch: this.state.newSearch,
      loading: true,
      timeout: timeout
    });

    return false;
  },
  /*jshint ignore:start */
  render: function() {
    var content;

    if (this.state.currentSearch) {
      if (this.state.loading) {
        content = (
          <div>
            <Spinner />
          </div>
        );
      } else {
        content = (
          <div>
            <h2 className="h2">{this.state.results.length} results match "{this.state.currentSearch}"</h2>
            <SearchResults results={this.state.results}/>
          </div>
        );
      }
    }

    return (
      <div>
        <form onSubmit={this.runSearch}>
          <input type="text" placeholder="Search papers" size="60" valueLink={this.linkState('newSearch')}/>
          <button type="submit">Go</button>
        </form>
        {content}
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = Search;
